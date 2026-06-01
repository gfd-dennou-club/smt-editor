<?php
// smt_storage.php

// -------------------------------------------------------------------------
// 1. セキュリティ・CORSヘッダーの設定とタイムゾーン固定
// -------------------------------------------------------------------------
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// プリフライト（事前確認）リクエストは即座に終了させる
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// 時刻を日本時間（JST）に完全固定
date_default_timezone_set('Asia/Tokyo');

// -------------------------------------------------------------------------
// 2. 外部設定ファイル (php_config.ini) の読み込み（701対策版）
// -------------------------------------------------------------------------
$config_file = 'PATH/php_config.ini';  //要修正

if (!file_exists($config_file)) {
    http_response_code(500);
    echo json_encode(["error" => "設定ファイル(php_config.ini)が見つかりません。"]);
    exit;
}

// ホームディレクトリが701でも確実に中身を吸い上げる迂回ロジック
$config = false;
$file_content = @file_get_contents($config_file);
if ($file_content !== false) {
    $config = parse_ini_string($file_content, true); // 文字列からINIとしてパース
}

if ($config === false) {
    http_response_code(500);
    echo json_encode(["error" => "php_config.ini の読み込み、または構文にエラーがあります。"]);
    exit;
}

// 入力されたパスワードの取得
$input_password = $_REQUEST['password'] ?? '';
if (empty($input_password)) {
    http_response_code(403);
    echo json_encode(["error" => "パスワードを入力してください。"]);
    exit;
}

// -------------------------------------------------------------------------
// 3. パスワードの照合 と 保存先サブフォルダ・書き込み権限の決定
// -------------------------------------------------------------------------
$passwords_list = $config['passwords'] ?? [];
$is_valid_password = false;
$sub_folder_name = '';
$is_readonly = false; // 書き込み禁止フラグの初期化

foreach ($passwords_list as $folder => $pass) {
    $readonly_check = false;
    $clean_pass = $pass;

    // パスワードの末尾が「:ro」で終わっているか判定
    if (substr($pass, -3) === ':ro') {
        $readonly_check = true;
        $clean_pass = substr($pass, 0, -3); // 「:ro」を除いた純粋なパスワード
    }

    // 入力されたパスワードと一致するか
    if ($input_password === $clean_pass) {
        $is_valid_password = true;
        $sub_folder_name = $folder;
        $is_readonly = $readonly_check; // 対象フォルダの閲覧専用設定を同期
        break;
    }
}

// パスワードがどれにも一致しなかった場合
if (!$is_valid_password) {
    http_response_code(403);
    echo json_encode(["error" => "パスワードが違います。"]);
    exit;
}

// 安全なフォルダ名にクレンジングし、最終的な保存先パスを決定
$safe_sub_folder = basename(preg_replace('/[\x00-\x1F\x7F<>:"\/\\\|\?\*]/', '', $sub_folder_name));
$base_save_dir = '/var/www/html/smt_files/';
$save_dir = $base_save_dir . $safe_sub_folder . '/'; // 例: smt_files/kani2026/

$action = $_REQUEST['action'] ?? '';

// -------------------------------------------------------------------------
// 【機能1】 サーバーへの保存 (action=save)
// -------------------------------------------------------------------------
if ($action === 'save') {
    // ★ パスワードに「:ro」が指定されているフォルダは保存をブロック
    if ($is_readonly) {
        http_response_code(403);
        echo json_encode(["error" => "このフォルダは読み込み専用です。ファイルを保存することはできません。"]);
        exit;
    }

    $filename = $_POST['filename'] ?? 'project';
    
    // 不正な文字を排除して安全なベース名にする
    $safe_filename = basename(preg_replace('/[\x00-\x1F\x7F<>:"\/\\\|\?\*]/', '', $filename));
    
    // 元のファイル名から拡張子を切り離す
    $extension = pathinfo($safe_filename, PATHINFO_EXTENSION);
    $pure_name = pathinfo($safe_filename, PATHINFO_FILENAME);
    
    if ($extension !== 'sb3') {
        $pure_name = $safe_filename; 
    }

    // 日本時間（JST）での日付・時刻サフィックスを生成 (例: _20260601_1720)
    $datetime_suffix = '_' . date('Ymd_Hi');

    // 「元の名前 + _日付_時刻 + .sb3」
    $final_filename = $pure_name . $datetime_suffix . '.sb3';

    // アップロードされたファイルのチェック
    if (isset($_FILES['file']) && $_FILES['file']['error'] === UPLOAD_ERR_OK) {
        // サブフォルダがなければ自動作成する
        if (!is_dir($save_dir)) {
            mkdir($save_dir, 0755, true);
        }

        // 移動して保存
	if (move_uploaded_file($_FILES['file']['tmp_name'], $save_dir . $final_filename)) {
            http_response_code(200);
            header('Content-Type: application/json');
            echo json_encode(["success" => "サーバーへの保存に成功しました！\nファイル名: " . $final_filename]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "サーバー上でのファイル書き込みに失敗しました。"]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["error" => "有効なファイルデータが届いていません。"]);
    }
    exit;
}

// -------------------------------------------------------------------------
// 【機能2】 ファイル一覧の取得 (action=list)
// -------------------------------------------------------------------------
if ($action === 'list') {
    $files = [];
    if (is_dir($save_dir)) {
        // パスワードに紐づくサブフォルダ内のみをスキャン
        foreach (glob($save_dir . "*.sb3") as $filepath) {
            $files[] = [
                'name' => basename($filepath),
                'time' => date("Y-m-d H:i", filemtime($filepath)) // 日本時間で表示
            ];
        }
    }
    
    // ファイル名順（昇順）にソート
    usort($files, function($a, $b) { 
        return strcmp($a['name'], $b['name']); 
    });
    
    header('Content-Type: application/json');
    echo json_encode($files);
    exit;
}

// -------------------------------------------------------------------------
// 【機能3】 指定されたファイルの読み込み (action=load)
// -------------------------------------------------------------------------
if ($action === 'load') {
    $filename = $_GET['filename'] ?? '';
    $safe_filename = basename($filename);
    $filepath = $save_dir . $safe_filename;

    if (file_exists($filepath) && pathinfo($filepath, PATHINFO_EXTENSION) === 'sb3') {
        header('Content-Type: application/octet-stream');
        header('Content-Length: ' . filesize($filepath));
        readfile($filepath);
    } else {
        http_response_code(404);
        echo json_encode(["error" => "指定されたファイルが見つかりません。"]);
    }
    exit;
}

// -------------------------------------------------------------------------
// ルーティングのどれにも該当しない場合
// -------------------------------------------------------------------------
http_response_code(200);
echo "smt_storage.php は正常に稼働しています。タイムゾーン: " . date_default_timezone_get();