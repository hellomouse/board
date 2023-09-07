export const pinTypeNameToNumber = type => {
    let tmp = ['Markdown', 'ImageGallery', 'Link', 'Checklist'].indexOf(type);
    return tmp < 0 ? 0 : tmp;
}
