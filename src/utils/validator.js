export const requiredField = (value) => {
    if (!value.toString().trim().length) {
        return "El campo es obligatorio";
    }
    return null;
}

export const isEmail = (value) => {
    if (!value.match(/(.+)@(.+){2,}\.(.+){2,}/)) {
        return "Introduzca un email válido";
    }
    return null;
}

export const onlyLetters = (value) => {
    if (!value.match(/^[a-zA-Z ñÑáéíóúÁÉÍÓÚ]+$/)) {
        return "Solo se permiten letras";
    }
    return null;
}


export const onlyNumber = (value) => {
    if (!value.match(/^[0-9]+$/)) {
        return "El formato no coincide";
    }
    return null;
}

export const numberMinMax = (value, valueMax ,valueMin) => {
    if (valueMax == null && value < valueMin) {
        return `El valor debe ser igual o mayor a ${valueMin}`
    }
    if (valueMin == null && value > valueMax) {
        return `El valor debe ser igual o menor a ${valueMax}`
    }
    if (value > valueMax || value < valueMin) {
        return `El valor debe estar entre ${valueMin} y ${valueMax}`
    }
    return null;
}

export const longCadena = (value, valueMax, valueMin) => {
    if ((value.length < valueMin) && (valueMax === valueMin)) {
        return `El campo requiere exactamente ${valueMin} carácteres`;
    }
    if ((value.length < valueMin) && (valueMax === null)) {
        return `El campo requiere un mínimo de ${valueMin} carácteres`;
    }
    if ((value.length > valueMax) && (valueMin === null)) {
        return `El campo solo permite un máximo de ${valueMax} carácteres`;
    }
    if ((valueMax && value.length > valueMax) || (valueMax && value.length < valueMin)) {
        return `El campo requiere un máximo de ${valueMax} carácteres y ${valueMin} como mínimo`;
    }
    return null;
}

export const validPassword = (value, valueLength) => {
    if (value.length < valueLength) {
        return `La contraseña debe tener mínimo ${valueLength} carácteres`;
    }
    if (!value.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])([A-Za-z\d$@$!%*?&]|[^ ]){8,15}$/)) {
        return "Debe tener Mayúsculas, minúsculas, un número, sin espacios";
    }
    return null;
}

export const isBoolean = (value) => {
    if (typeof value==='boolean') {
        return null;
    }
    return "Debe ser true o false";
}