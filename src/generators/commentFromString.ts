function escapeCommentEndTag(str: string) {
  return str.replace(/\*\//g, '*&#8205;/')
}

export function commentFromString(str: string) {
  if (!str) {
    return ''
  }

  return `/**
${str
    .split('\n')
    .map(s => ` * ${escapeCommentEndTag(s)}`)
    .join('\n')}
 */`
}
