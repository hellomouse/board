<!--
Example:
<code-diff style="width: 100%" :old-string="oldHtml" :new-string="newHtml" />
-->

<template>
    <div class="overflow-y-auto">
        <div class="d-flex">
            <div class="code code-diff-block pa-2" v-html="diffString.leftHtml" />
            <div class="code code-diff-block pa-2" v-html="diffString.rightHtml" />
        </div>
    </div>
</template>

<script>
import { diffArrays } from 'diff';
import { parse } from 'node-html-parser';

export default {
    props: {
        oldString: {
            type: String,
            required: true
        },
        newString: {
            type: String,
            required: true
        }
    },
    computed: {
        diffString() {
            let html1 = parse(this.oldString);
            let html2 = parse(this.newString);
            const html2Array = html => {
                let tmp = html.childNodes.map(node => node.outerHTML ? [node.outerHTML] : node.text.split(/(?=\s)/g));
                if (!tmp || !tmp.length) return [];
                return tmp.reduce((a, b) => (a || []).concat(b || []));
            }

            const diff = diffArrays(html2Array(html1), html2Array(html2));
            let [leftHtml, rightHtml] = ['', '']

            for (let part of diff) {
                let val = part.value.join('');
                if (part.added)
                    rightHtml += `<span class='code-diff-highlight-red'>${val}</span>`;
                else if (part.removed)
                    leftHtml += `<span class='code-diff-highlight-green'>${val}</span>`;
                else {
                    leftHtml += val;
                    rightHtml += val;
                }
            }
            leftHtml = leftHtml.replaceAll('\n', '<br>');
            rightHtml = rightHtml.replaceAll('\n', '<br>');
            return { leftHtml, rightHtml };
        }
    }
}
</script>

<style lang="scss" scoped>
.code {
    display: block;
    width: 50%;
    background: rgba(var(--v-theme-background), 0.75);
}
.code:not(:first-child) {
    border-left: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}
</style>

<style lang="scss">
.code-diff-block {
    ol, ul { padding-left: 20px; }
    img { max-width: 100%; }
}

.code-diff-highlight-red {
    &, & > * {
        background-color: rgba(var(--v-theme-error), 0.3);
    }
}
.code-diff-highlight-green {
    &, & > * {
        background-color: rgba(var(--v-theme-success), 0.3);
    }
}
</style>