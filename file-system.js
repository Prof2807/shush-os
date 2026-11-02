

export function fileSystem() {

    const fileStorage = []

    async function createFile(name, fileType, parentId) {

        if (!name) { console.error("File name invalid!"); return }
        if (fileStorage.find(file => file.name === name && file.parentId === parentId)) { console.error("File with this name already exists!"); return }

        const date = Date.now()

        const newFile = {
            id: crypto.randomUUID(),
            name: name,
            parentId: parentId || null,
            type: "file",
            fileType: fileType,
            content: "",
            createdAt: date,
            modifiedAt: date
        }
        fileStorage.push(newFile)
        return structuredClone(newFile)

    }

    async function getFile(id) {

        const file = fileStorage.find(file => file.id === id)

        if (!file) { console.error("File not found!"); return }

        return structuredClone(file)

    }

    async function listNodes() {

        return structuredClone(fileStorage)

    }

    async function renameFile(newName, id) {

        if (!newName) { console.error("New file name invalid!"); return }

        const file = fileStorage.find(file => file.id === id)

        if (!file) { console.error("File not found!"); return }
        if (fileStorage.find(f => f.name === newName && f.id !== id && f.parentId === file.parentId)) { console.error("File with this name already exists!"); return }

        const date = Date.now()
        file.name = newName
        file.modifiedAt = date

        console.log("Item successfully rename at " + date)
        return structuredClone(file)

    }

    async function deleteFile(id) {

        const fileIdx = fileStorage.findIndex(file => file.id === id)

        if (fileIdx !== -1) {

            fileStorage.splice(fileIdx, 1)

            console.log("Item deleted successfully")
            return id

        } else {

            console.error("Cannot find file")

        }

    }

    async function createFolder(name, parentId) {

        const time = Date.now()

        if (!name) {throw new Error("Folder name invalid!")}
        if (fileStorage.find(folder => folder.name === name && folder.parentId === parentId)) {throw new Error("Folder with this name already exists!")}

        if (parentId) {
            const parentExits = fileStorage.some(folder => folder.id === parentId)
            if (!parentExits) {
                throw new Error(`Parent folder with Id "${parentId}" not found`)
            }
        }

        const folder = {
            id: crypto.randomUUID(),
            name: name,
            parentId: parentId || null,
            type: "folder",
            createdAt: time,
            modifiedAt: time
        }

        fileStorage.push(folder)
        return structuredClone(folder)

    }

    async function getChildren(parentId) {

        if (parentId && parentId !== null) {
            const parentExits = fileStorage.some(folder => folder.id === parentId && folder.type === "folder")

            if (!parentExits) {
                throw new Error(`Parent folder with Id "${parentId}" not found or isn't a folder`)
            }

            const children = fileStorage.filter((folder => folder.parentId === parentId))
            return structuredClone(children)

        }

        if (parentId === null || !parentId) {
            const children = fileStorage.filter((folder => folder.parentId === null))
            return structuredClone(children)
        }


    }

    async function deleteFolder(id) {

        const folder = fileStorage.find(folder => folder.id === id)

        if (!folder) {
            throw new Error(`Folder with Id "${id} doesn't exist!`)
        }

        const children = fileStorage.filter(folder => folder.parentId === id)

        if (children.length) {
            for (let i = 0; i < children.length; i++) {
                if (children[i].type !== "folder") {
                    await deleteFile(children[i].id)
                } else if (children[i].type === "folder") {
                    await deleteFolder(children[i].id)
                }
            }
        }

        const index = fileStorage.findIndex(folder => folder.id === id)

        fileStorage.splice(index, 1)
        console.log("Folder deleted successfully")
        return id
    }

    return {
        createFile,
        getFile,
        listNodes,
        renameFile,
        deleteFile,
        createFolder,
        getChildren,
        deleteFolder,
    }

}