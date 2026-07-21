/**
 * Smalruby Converter Common Utilities
 */
const SmT_Common = {

    /**
     * 変数名から特定のプレフィックス（クラス名の小文字）を除去して、ピン番号を抽出する
     * 「gpio13」およびScratch内部名「_gpio13_1_」の両方に対応
     * @param {string} varName - 変数名
     * @param {string} prefix - プレフィックス (例: "gpio")
     * @returns {number|null} ピン番号。マッチしない場合は null
     */
    getPinFromVarName: function (varName, prefix) {
        if (!varName) return null;
        // 例: "_gpio13_1_" や "gpio13" から "13" をグループ2として抽出する
        const regex = new RegExp(`^(_)?${prefix}(\\d+)(?:_\\d+)?_?$`);
        const match = varName.match(regex);
        return match ? parseInt(match[2], 10) : null;
    },
    
    /**
     * 指定したブロックの穴（inputName）に変数ブロックを生成して接続する
     * @param {object} converter - Smalrubyのconverterオブジェクト
     * @param {object} parentBlock - 親となるブロック（ADCやGPIOのブロック）
     * @param {string} inputName - 接続先の入力名（"INSTANCE"など）
     * @param {object} varSource - 元となる変数情報（variableまたはreceiver）
     * @returns {string} 取得した変数名
     */
    attachVariableBlock: function (converter, parentBlock, inputName, varSource) {
        if (!varSource) return "";

        if (typeof varSource === 'string') {
            const vBlock = converter.createBlock('data_variable', 'value');
            converter.addField(vBlock, 'VARIABLE', varSource);
            converter.addInput(parentBlock, inputName, vBlock);
            return varSource;
        }

        let varName = "";
        let varId = null;

        if (varSource.opcode === 'data_variable') {
            // すでに生成された「変数ブロック」が渡ってきた場合
            const varField = varSource.fields && varSource.fields.VARIABLE;
            varName = varField ? varField.value : "";
            varId = varField ? varField.id : null; // 正しい変数IDはここに隠れています
        } else {
            // 上流のASTから渡ってきた「変数のメタデータ」の場合
            const varField = varSource.fields && varSource.fields.VARIABLE;
            varName = varSource.name || varSource.value || (varField ? varField.value : "");
            varId = varSource.id || (varField ? varField.id : null);
        }
	
        const vBlock = converter.createBlock('data_variable', 'value');
        converter.addField(vBlock, 'VARIABLE', varName);
        
        // 正しい変数IDをセットする
        if (varId) {
            vBlock.fields.VARIABLE.id = varId;
        }
        
        converter.addInput(parentBlock, inputName, vBlock);
        return varName;
    },
    
    /**
     * ブロックの表示範囲（Location）を行頭からに補正する
     * @param {object} block - 補正対象のブロック
     */
    fixLocationToLineStart: function (block) {
        if (block && block.node && block.node.location) {
            const loc = block.node.location;
            loc.length += loc.startOffset;
            loc.startOffset = 0;
        }
    },

    /**
     * 多言語対応のエラーメッセージを取得する関数
     * ブラウザの言語設定 (navigator.language) を元に判定する
     * @param {string} errorId - エラーの種類
     * @param {number} [argIndex] - （オプション）エラーが起きた引数の番号
     */
    getErrorMessage: function (errorId, argIndex) {
        // ブラウザの言語設定を取得（取得できない場合は 'en' とする）
        const locale = (typeof navigator !== 'undefined' ? (navigator.language || navigator.userLanguage) : 'en') || 'en';
	// 言語設定が日本語か否かの判定
        const isJapanese = locale.startsWith('ja');

        // argIndex が指定されていれば「第x引数は」、なければ「ここは」にする
        const argTextJa = argIndex ? `第${argIndex}引数は` : `ここは`;
        const argTextEn = argIndex ? `Argument ${argIndex}` : `This argument`;
	
        switch (errorId) {
        case 'NOT_STRING':
            return isJapanese 
                ? `エラー：${argTextJa}文字列は指定できません。` 
                : `Error: ${argTextEn} must not be a string.`;
        case 'ONLY_POSITIVE_INTEGER_STRING_VARIABLE':
            return isJapanese 
                ? `エラー：${argTextJa}正の整数，文字列，変数のいずれかを指定してください。` 
                : `Error: ${argTextEn} must be an positive integer or string or variable.`;
        case 'ONLY_VARIABLE':
            return isJapanese 
                ? `エラー：${argTextJa}変数しか指定できません。` 
                : `Error: ${argTextEn} must be a variable.`;
        case 'ONLY_POSITIVE_INTEGER':
            return isJapanese 
                ? `エラー：${argTextJa}正の整数を指定してください。` 
                : `Error: ${argTextEn} must be an integer.`;
        case 'ONLY_INTEGER':
            return isJapanese 
                ? `エラー：${argTextJa}整数を指定してください。` 
                : `Error: ${argTextEn} must be an integer.`;
        case 'ONLY_STRING':
            return isJapanese 
                ? `エラー：${argTextJa}文字列（テキスト）を指定してください。` 
                : `Error: ${argTextEn} must be a string.`;
	case 'INVALID_GPIO_DIRECTION':
            return isJapanese 
                ? `エラー：${argTextJa}「GPIO::IN」「GPIO::OUT」「GPIO::IN|GPIO::PULL_UP」「GPIO::PULL_DOWN」のいずれかを指定してください。` 
                : `Error: ${argTextEn} must be GPIO::IN, GPIO::OUT, GPIO::IN|GPIO::PULL_UP, or GPIO::PULL_DOWN.`;
        case 'ONLY_ZERO_OR_ONE_OR_VARIABLE':
            return isJapanese 
                ? `エラー：${argTextJa} 0 か 1，もしくは変数を指定してください。` 
                : `Error: ${argTextEn} must be 0 or 1 or variable.`;
        case 'ONLY_POSITIVE_INTEGER':
            return isJapanese
                ? `エラー：${argTextJa} 0以上の整数（ピン番号）を指定してください。`
                : `Error: ${argTextEn} must be a positive integer.`;
	case 'INVALID_PWM_TIMER':
            return isJapanese 
                ? `エラー：${argTextJa} 0から4までの整数（タイマー番号）を指定してください。` 
                : `Error: ${argTextEn} must be an integer between 0 and 4.`;
        case 'INVALID_PWM_DUTY':
            return isJapanese 
                ? `エラー：${argTextJa} 0から100までの整数（デューティ比）を指定してください。` 
                : `Error: ${argTextEn} must be an integer between 0 and 100.`;
        case 'INVALID_INSTANCE_NAME':
            return isJapanese 
                ? `エラー：${argTextJa} インスタンス名に含まれる数字はピン番号にしてください (例: adc12 = ADC.new(12)。` 
                : `Error: ${argTextEn} instance name must match the pin number (eg. adc12 = ADC.new(12)).`;
        case 'INVALID_INSTANCE_NAME2':
            return isJapanese 
                ? `エラー：${argTextJa} インスタンス名はクラス名の小文字としてください (例: i2c = I2C.new)。` 
                : `Error: ${argTextEn} instance name must match the class name (eg. i2c = I2C.new).`;
        default:
            return isJapanese 
                ? "予期せぬエラーが発生しました。" 
                : "An unexpected error occurred.";
        }
    }

};

export default SmT_Common;
