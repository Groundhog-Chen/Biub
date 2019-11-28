export default {
    text(node: any, value: string): void {
        const regex = /\{\{(.*)\}\}/;
        if (regex.exec(node.textContent)) {
            const str = (regex.exec(node.textContent))[0];
            if (typeof value !== 'undefined') {
                node.textContent = node.textContent.replace(str, value);
                node.setVal = value;
            } else {
                node.textContent = node.textContent.replace(str, '')
            }
        } else {            
            node.textContent = node.textContent.replace(node.setVal + '', value);
            node.setVal = value;
        }
    },
    model(node: HTMLInputElement, value: string, oldValue: string): void {
        node.value = typeof value == 'undefined' ? '' : value;
    }
}