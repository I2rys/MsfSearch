//Dependencies
const Chalk = require("chalk")
const Path = require("path")
const Fs = require("fs")

//Variables
const Self_Args = process.argv.slice(2)

var Self = {}

function directory_files(dir, done) {
    var results = []

    Fs.readdir(dir, function (err, list) {
        if (err) return done(err)

        var list_length = list.length

        if (!list_length) return done(null, results)

        list.forEach(function (file) {
            file = Path.resolve(dir, file)

            Fs.stat(file, function (err, stat) {
                if (stat && stat.isDirectory()) {
                    directory_files(file, function (err, res) {
                        results = results.concat(res)

                        if (!--list_length) done(null, results)
                    })
                } else {
                    results.push(file)
                    
                    if (!--list_length) done(null, results)
                }
            })
        })
    })
}

//Main
if(Self_Args.length == 0){
    console.log(`node index.js <keyword>
Example: node index.js nice`)
    process.exit()
}

if(Self_Args[0] == ""){
    console.log("Invalid keyword.")
    process.exit()
}

Self_Args[0] = Self_Args[0].toLowerCase()

var results = []

directory_files("./modules", function(err, files){
    if(err){
        console.log("Something went wrong while reading the modules directory.")
        process.exit()
    }

    if(!files){
        console.log("No files found in modules directory.")
        return
    }

    files.forEach(file =>{
        var result = ""
        var splitted = file.replace(`${__dirname}\\modules`, "").split("\\")

        for( i in splitted ){
            splitted[i] = splitted[i].toLowerCase()

            if(splitted[i] == Self_Args[0]){
                splitted[i] = Chalk.redBright(splitted[i])
            }

            if(result.length == 0){
                result = splitted[i]
            }else{
                result += `/${splitted[i]}`
            }
        }

        if(result.indexOf(Self_Args[0]) != -1 && result.indexOf("[") != -1){
            result = result.replace(/.\w+.js/g, "")
            results.push(result)
        }
    })

    if(!results.length){
        console.log("Unable to find & list all the modules with that keyword, please type a valid keyword.")
        process.exit()
    }

    for( i in results ){
        console.log(results[i])
    }
})
