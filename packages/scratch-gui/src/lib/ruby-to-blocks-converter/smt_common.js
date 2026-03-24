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
    }
};

export default SmT_Common;
