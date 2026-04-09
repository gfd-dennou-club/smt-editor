/**
 * Smalruby Converter Common Utilities
 */
const SmT_Common = {
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

        const varField = varSource.fields && varSource.fields.VARIABLE;
        const varName = varField ? varField.value : (varSource.name || "");
        const varId = varField ? varField.id : null;

        const vBlock = converter.createBlock('data_variable', 'value');
        converter.addField(vBlock, 'VARIABLE', varName);
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
        case 'ONLY_ZERO_OR_ONE':
            return isJapanese 
                ? `エラー：${argTextJa} 0 か 1 を指定してください。` 
                : `Error: ${argTextEn} must be 0 or 1.`;
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
        default:
            return isJapanese 
                ? "予期せぬエラーが発生しました。" 
                : "An unexpected error occurred.";
        }
    }

};

export default SmT_Common;
