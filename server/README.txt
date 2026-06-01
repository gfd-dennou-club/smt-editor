== 保管フォルダの設定

* ユーザのファイル (.sb3) をサーバに保存できるようにする．
* 講習会毎にサブフォルダとパスワードを設定できるようにする．

== ディレクトリ構造

以下のようにファイルを配置する

/
├── home/
│   └── hogehoge/
│       └── php_config.ini      <-- [701権限でもOK] パスワード・フォルダ設定ファイル
│
└── var/
    └── www/
        └── html/
            ├── smt_storage.php  <-- PHPメインプログラム
            └── smt_files/       <-- 自動作成される保存先ベースフォルダ
                ├── esp32/       <-- php_config.ini でパスワードを定義
                └── sample/      <-- php_config.ini でパスワードを定義

== 注意

smt-editor/server/smt_storage.php に php_config.ini のパスが直書きされているので，
そこを修正する必要がある．

smt-editor/packages/scratch-gui/src/components/menu-bar/menu-bar.jsx の
PHP プログラムのパスを修正すること
