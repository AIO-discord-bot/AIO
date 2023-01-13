

const bold = /\*\*(.*)\*\*/gim

const italic = /\*(.*)\*/gim

const strikethrough = /~~(.*)~~/gim

const code = /`(.*)`/gim

const link = /\[(.*)\]\((.*)\)/gim

const image = /!\[(.*)\]\((.*)\)/gim


function parseMarkdown(markdownText) {
	const htmlText = markdownText
		.replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>')
		.replace(/\*\*(.*)\*\*/gim, '<b>$1</b>')
		.replace(/\*(.*)\*/gim, '<i>$1</i>')
		.replace(/!\[(.*?)\]\((.*?)\)/gim, "<img alt='$1' src='$2' />")
		.replace(/\[(.*?)\]\((.*?)\)/gim, "<a href='$2'>$1</a>")
		.replace(/\n$/gim, '<br />')

	return htmlText.trim()
}
