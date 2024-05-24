import firebaseConfig from "./firebaseConfig"
import { initializeApp } from "firebase/app"
import { ref, getStorage, listAll, getDownloadURL, uploadBytes, deleteObject } from "firebase/storage"
import {
    getAuth,
    signOut,
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    sendPasswordResetEmail,
} from "firebase/auth"
import { getFirestore, updateDoc, deleteDoc, collection, getDocs, setDoc, doc } from "firebase/firestore"

const db = getFirestore()
const storage = getStorage()
const app = initializeApp(firebaseConfig)

const setUpdateSelectedProductToFirestore = async (
    { title, productId, originalPrice, discountPrice, desc, tabDesc, deliveryDesc, stock, quantity, imageFileName },
    callBack
) => {
    try {
        await updateDoc(doc(db, "products", title), {
            title,
            productId,
            originalPrice,
            discountPrice,
            desc,
            tabDesc,
            deliveryDesc,
            stock,
            quantity,
            imageFileName,
        })
        callBack && callBack()
    } catch (err) {
        console.error("Error: ", err)
    }
}

const setRemoveProductTabImageFromStorage = async productTitle => {
    const folderRef = ref(storage, `Images/products/tabs/${productTitle}`)
    const storageItemList = await listAll(folderRef)
    try {
        await Promise.all(
            storageItemList?.items?.map(async item => {
                try {
                    await deleteObject(item)
                } catch (error) {
                    console.error("Error: ", error)
                }
            })
        )
    } catch (err) {
        console.error("Error: ", err)
    }
}

const setRemoveProductImageFromStorage = async imageFileName => {
    console.log("🚀 - imageFileName", imageFileName)
    const imageRef = ref(storage, `Images/products/${imageFileName}`)

    try {
        await deleteObject(imageRef)
    } catch (err) {
        console.error("Error: ", err)
    }
}

const setRemoveProductDataFromFirestore = async (productName, callBack) => {
    try {
        await deleteDoc(doc(db, "products", productName))
        callBack && callBack()
    } catch (err) {
        console.error("Error: ", err)
    }
}

const setProductDataToFirestore = async (
    {
        productName,
        title,
        productId,
        originalPrice,
        discountPrice,
        desc,
        tabDesc,
        deliveryDesc,
        stock,
        quantity,
        imageFileName,
    },
    callBack
) => {
    try {
        await setDoc(doc(db, "products", productName), {
            title,
            productId,
            originalPrice,
            discountPrice,
            tabDesc,
            desc,
            deliveryDesc,
            stock,
            quantity,
            imageFileName,
        })
        callBack && callBack()
    } catch (err) {
        console.error("Error: ", err)
    }
}

const setProductImageToStorage = async imageFile => {
    const imageRef = ref(storage, `Images/products/${imageFile.name}`)
    try {
        await uploadBytes(imageRef, imageFile).then(snapshot => {
            console.log("🚀 - imageRef", imageRef)
            console.log("🚀 - snapshot", snapshot)
            console.log("Uploaded a blob or file!")
        })
    } catch (err) {
        console.error("Error: ", err)
    }
}

const setUploadProductImageToStorage = async (imageFile, productTitle) => {
    console.log("🚀 - imageFile:", imageFile)
    const folderRef = ref(storage, `Images/products/${productTitle}`)
    const imageRef = ref(storage, `Images/products/${imageFile.name}`)
    const removeRef = ref(storage, `Images/products/`)
    if (Object.keys(imageFile).length !== 0) {
        const storageItemList = await listAll(folderRef)
        try {
            await Promise.all(
                storageItemList?.items?.map(async item => {
                    try {
                        if (item.name.split(".")[0].includes(productTitle)) {
                            await deleteObject(item)
                            console.log("Image deleted successfully")
                        }
                    } catch (error) {
                        console.error("Error: ", error)
                    }
                })
            )
        } catch (err) {
            console.error("Error: ", err)
        }
    }

    try {
        const removeItemList = await listAll(removeRef)

        await Promise.all(
            removeItemList.items.map(async item => {
                try {
                    if (item.name.split(".")[0].includes(productTitle)) {
                        await deleteObject(item)
                        console.log("Image deleted successfully")
                    }
                } catch (error) {
                    console.error("Error: ", error)
                }
            })
        )
    } catch (error) {
        console.error("Error: ", error)
    }

    try {
        await Promise.all(
            await uploadBytes(imageRef, imageFile).then(snapshot => {
                console.log("Uploaded a blob or file!")
            })
        )
    } catch (error) {
        console.error("Error: ", error)
    }
}

const setProductTabImageToStorage = async imageFiles => {
    if (!imageFiles) {
        return console.error("imageFiles is undefined")
    }

    try {
        for (const file of imageFiles) {
            const storageRef = ref(storage, `Images/products/tabs/${file.productName}`)
            const storageItemList = await listAll(storageRef)

            await Promise.all(
                storageItemList.items.map(async item => {
                    try {
                        await deleteObject(item)
                        console.log("Image deleted successfully")
                    } catch (error) {
                        console.error("Error: ", error)
                    }
                })
            )
        }
    } catch (error) {
        console.error("Error: ", error)
    }

    try {
        await Promise.all(
            imageFiles.map(async file => {
                const imageRef = ref(storage, `Images/products/tabs/${file.productName}/${file.name}`)
                await uploadBytes(imageRef, file.file)
                console.log("Image uploaded successfully")
            })
        )
    } catch (error) {
        console.error("Error: ", error)
    }
}

const getProductImagesFromStorage = async () => {
    const storageRef = ref(storage, `Images/products/`)
    const storageItemList = await listAll(storageRef)
    const { items } = storageItemList
    let imagesData = []

    await Promise.all(
        items.map(async imageRef => {
            const imageUrl = await getDownloadURL(imageRef)
            imagesData.push(imageUrl)
        })
    )

    return imagesData
}

const getSubImagesFromStorage = async () => {
    const storageRef = ref(storage, `Images/subImgs/`)
    const storageItemList = await listAll(storageRef)
    const { items } = storageItemList
    let imagesData = []

    await Promise.all(
        items.map(async imageRef => {
            const imageUrl = await getDownloadURL(imageRef)
            imagesData.push(imageUrl)
        })
    )

    return imagesData
}

const getTabImagesFromStorage = async productName => {
    const storageRef = ref(storage, `Images/products/tabs/${productName}`)
    const storageItemList = await listAll(storageRef)
    const { items } = storageItemList
    let imagesData = []

    await Promise.all(
        items.map(async imageRef => {
            const imageUrl = await getDownloadURL(imageRef)
            imagesData.push(imageUrl)
        })
    )

    return imagesData
}

const getProductListFromFirestore = async () => {
    const querySnapshot = await getDocs(collection(db, "products"))
    let productsData = []

    try {
        querySnapshot.forEach(doc => {
            productsData.push({ ...doc.data() })
        })
    } catch (error) {
        console.log(error)
    }
    return productsData
}

const ResetPassword = async email => {
    const auth = getAuth()
    try {
        const result = await sendPasswordResetEmail(auth, email)
        return result
    } catch (error) {
        console.log("🚀 ResetPassword - error.message", error.message)
        return error.message
    }
}

const handleLogoutAuth = async () => {
    const auth = getAuth()
    try {
        const result = await signOut(auth)
        return result
    } catch (error) {
        console.log("🚀 ResetPassword - error.message", error.message)
        return error.message
    }
}

const handleLoginOrRegister = async (email, password) => {
    const auth = getAuth()
    try {
        const result = await signInWithEmailAndPassword(auth, email, password)
        return result
    } catch (error) {
        if (error.message === "Firebase: Error (auth/user-not-found).") {
            const result = await handleRegisterWithEmailAndPassWord(auth, email, password)
            return result
        }
    }
}

const handleRegisterWithEmailAndPassWord = async (auth, email, password) => {
    try {
        const UserCredential = await createUserWithEmailAndPassword(auth, email, password)
        return UserCredential
    } catch (error) {
        const errorCode = error.code
        const errorMessage = error.message
        // ..
    }
}

const handleLoginWithGoogle = async () => {
    const provider = new GoogleAuthProvider()
    const auth = getAuth()
    signInWithPopup(auth, provider)
        .then(async result => {
            const credential = GoogleAuthProvider.credentialFromResult(result)
            const token = credential.accessToken
            const user = result.user
            console.log("GoogleResult:", result)
            // 在這邊把user資料寫入locaStorage或是進行後端寫入資料庫等等的操作
        })
        .catch(error => {
            console.log(error)
        })
}

export {
    setUpdateSelectedProductToFirestore,
    setRemoveProductImageFromStorage,
    setRemoveProductTabImageFromStorage,
    setRemoveProductDataFromFirestore,
    setProductImageToStorage,
    setProductDataToFirestore,
    setUploadProductImageToStorage,
    setProductTabImageToStorage,
    getProductListFromFirestore,
    getTabImagesFromStorage,
    getSubImagesFromStorage,
    getProductImagesFromStorage,
    handleLoginWithGoogle,
    handleLoginOrRegister,
    handleRegisterWithEmailAndPassWord,
    ResetPassword,
    handleLogoutAuth,
}
