
function _arrayBufferToBase64( buffer ) {
    var binary = '';
    var bytes = new Uint16Array( buffer );
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode( bytes[ i ] );
    }
    return binary;
}


export const exportNodeSVG = async (node) => {
    console.log(node)
    return new Promise((resolve, reject) => {
        node.exportAsync({format: 'SVG', svgIdAttribute: true}).then(res => {
            let result = _arrayBufferToBase64(res);
            resolve (result);
        }).catch(err => reject(err));
    })
}

export const convertToSlug = str => {
    
    if (!str) return null;
    // we are going to omit chaning around the casing....this could mess up
    // Veeva and a lot of things
    //return str.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-')
    return str;

};

export const idCleanup = (id) => {
    return id.split(':').join('-').split(';').join('-');
}