// Display label for a post tag: "home-assistant" -> "Home Assistant".
export function tagLabel(tag: string): string {
    return tag.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
}
