/**
 * Convert saved string to checklist
 * @param {string} content Saved content
 * @return {Array} checklist
 */
export function contentToChecklist(content) {
    const lines = content.split('\n');
    return lines.map((line, i) => ({
        checked: line[0] === '1',
        value: line.slice(1).replaceAll('\\n', '\n'),
        id: i + Math.random()
    }));
}

/**
 * Convert checklist to saved string
 * @param {Array} checklist
 * @return {string} content
 */
export function checklistToContent(checklist) {
    return checklist.map(x => `${x.checked ? '1' : '0'}${x.value.replaceAll('\n', '\\n')}`).join('\n');
}
