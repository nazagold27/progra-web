let ciudad = 'Buenos Aires'
let pais = "Argentina"
let edad = 19

console.log(ciudad, pais, edad)

ciudad = "Miami"
pais = "Estados Unidos"
edad = 21

console.log(ciudad, pais, edad)

const datos = [ciudad, pais, edad]
console.log(datos)
datos.push("Cancun")
console.log(datos)


let n1 = 13
let n2 = 27
let n3 = 15
let suma = n1+n2+n3
let divisor = 3
let promedio = suma/divisor
let residuo = suma%2

console.log(residuo)
console.log(promedio)

let auto = {
    marca : "porsche",
    anio : 2018,
    modelo : "gt3rs"
}

console.log(typeof(auto.marca))
console.log(typeof(auto.anio))
console.log(typeof(auto.modelo))

const ciudades = ["Dublin","Vienna","NuevaYork","LosAngeles","Barcelona"]
console.log(ciudades)
ciudades[2] = "Berlin"
console.log(ciudades)

const peliculas = {
    titulo : ["LobodeWallstreet","LaVidaesBella", "ElPadrino"],
    director : ["Scorsese","Benigni","Coppola"],
    anio : ["2013","1997","1972"]
}
console.log(peliculas.director[2])

const PELICULASTODAS = [
{titulo:"LobodelWallstreet"},
{titulo:"LaVidaesBella"},
{titulo:"ElPadrino"},
{director:"Scorsese"},
{director:"Benigni"},
{director:"Coppola"},
{anio:"2013"},
{anio:"1997"},
{anio:"1972"},
]
console.log(PELICULASTODAS[5].director)

let a = true
let b = true
let c = false

let verdaderas = a && b || a && c || b && c

console.log(verdaderas)

let nombre = "Nazareno"
let apellido = "Goldstein"
let nya = nombre+" "+apellido
console.log(nya)

let numero1 = 27
console.log(numero1)
numero1++;
console.log(numero1)
numero1--;
console.log(numero1)

let v1 = " "
let v2 = null
console.log(typeof(v1))
console.log(typeof(v2))

let ej14 = "10"
let ej142 = Number(ej14)
console.log(typeof(ej142))