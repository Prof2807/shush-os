

export function fileSystem () {

    const fileStorage = []

    async function createFile ( name, fileType ) {

        if (fileStorage.find(file => file.name === name)) {console.error("File with this name already exists!"); return}
        if (!name) {console.error("File name invalid!"); return}

        const date = Date.now()
        
        const newFile = {
            id: crypto.randomUUID(),
            name: name,
            fileType: fileType,
            content: "",
            createdAt: date,
            modifiedAt: date
        }
        fileStorage.push(newFile)
        return structuredClone(newFile)

    }

    async function getFile ( id ) {

        const file = fileStorage.find(file => file.id === id)

        if (!file) {console.error("File not found!"); return}

        return structuredClone(file)

    }

    async function listFiles () {

        return structuredClone(fileStorage)

    }

    async function renameFile ( newName, id ) {

        if (!newName) {console.error("New file name invalid!"); return}
        
        const file = fileStorage.find( file => file.id === id )

        if (!file) {console.error("File not found!"); return}
        if (fileStorage.find(file => file.name === newName && file.id !== id)) {console.error("File with this name already exists!"); return}

        const date = Date.now()
        file.name = newName
        file.modifiedAt = date

        console.log("Item successfully rename at " + date)
        return structuredClone(file)

    }

    async function deleteFile ( id ) {

        const fileIdx = fileStorage.findIndex(file => file.id === id)

        if (fileIdx !== -1) {

            fileStorage.splice(fileIdx, 1)

            console.log("Item deleted successfully")
            return id

        } else {

            console.error("Cannot find file")

        }

    }

    return {
        createFile,
        getFile,
        listFiles,
        renameFile,
        deleteFile
    }

}