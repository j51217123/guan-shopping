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
import { getFirestore, updateDoc, deleteDoc, collection, getDocs, setDoc, doc, writeBatch } from "firebase/firestore"

const db = getFirestore()
const storage = getStorage()
const app = initializeApp(firebaseConfig)

const setUpdateSelectedProductToFirestore = async (
    { originalTitle, title, productId, originalPrice, discountPrice, desc, tabDesc, deliveryDesc, stock, quantity, imageFileName, mainImg },
    callBack
) => {
    try {
        const payload = {
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
            mainImg,
        }

        // doc ID 綁定於 title，改名時 updateDoc 會因目標 doc 不存在而丟錯；
        // 用 batch 原子執行「建新 doc + 刪舊 doc」避免中間狀態不一致。
        if (originalTitle && originalTitle !== title) {
            const batch = writeBatch(db)
            batch.set(doc(db, "products", title), payload)
            batch.delete(doc(db, "products", originalTitle))
            await batch.commit()
        } else {
            await updateDoc(doc(db, "products", title), payload)
        }
        callBack && callBack()
    } catch (err) {
        console.error("Error: ", err)
        throw err
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
    const imageRef = ref(storage, `Images/products/${imageFileName}`)

    try {
        await deleteObject(imageRef)
    } catch (err) {
        console.error("Error: ", err)
    }
}

const setRemoveProductDataFromFirestore = async (
    {
        productName,
        imageFileName
    },
    callBack
) => {
    try {
        await setRemoveProductImageFromStorage(imageFileName)
        await deleteDoc(doc(db, "products", productName))
        callBack && callBack()
    } catch (err) {
        console.error("Error: ", err)
    }
}

const setProductDataToFirestore = async (
    {
        uploadProductInfo,
        imageFile
    },
    callBack
) => {
    const {
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
        mainImg
    } = uploadProductInfo

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
            mainImg
        })
        await setProductImageToStorage(imageFile, productName)
        callBack && callBack()
    } catch (err) {
        console.error("Error: ", err)
    }
}

// 產生不重複檔名：{productName}_{timestamp}.{ext}。使用者上傳任何檔名都可。
const buildStorageFileName = (imageFile, productName) => {
    const parts = imageFile.name.split(".")
    const ext = parts.length > 1 ? parts.pop() : "jpg"
    return `${productName}_${Date.now()}.${ext}`
}

// Storage 圖片 cache 1 年，讓 CDN 與瀏覽器直接命中，避免每次重抓
const IMAGE_UPLOAD_METADATA = {
    cacheControl: "public, max-age=31536000, immutable",
}

const setProductImageToStorage = async (imageFile, productName) => {
    const storageFileName = buildStorageFileName(imageFile, productName)
    const imageRef = ref(storage, `Images/products/${storageFileName}`)
    try {
        await uploadBytes(imageRef, imageFile, IMAGE_UPLOAD_METADATA)
        const downloadURL = await getDownloadURL(imageRef)
        const productDocRef = doc(db, "products", productName)
        await updateDoc(productDocRef, { mainImg: downloadURL, imageFileName: storageFileName })
    } catch (err) {
        console.error("Error: ", err)
    }
}

// const setUploadProductImageToStorage = async (imageFile, productTitle) => {
//     console.log("🚀 - imageFile:", imageFile)
//     const folderRef = ref(storage, `Images/products/${productTitle}`)
//     const imageRef = ref(storage, `Images/products/${imageFile.name}`)
//     const removeRef = ref(storage, `Images/products/`)
//     if (Object.keys(imageFile).length !== 0) {
//         const storageItemList = await listAll(folderRef)
//         try {
//             await Promise.all(
//                 storageItemList?.items?.map(async item => {
//                     try {
//                         if (item.name.split(".")[0].includes(productTitle)) {
//                             await deleteObject(item)
//                             console.log("Image deleted successfully")
//                         }
//                     } catch (error) {
//                         console.error("Error: ", error)
//                     }
//                 })
//             )
//         } catch (err) {
//             console.error("Error: ", err)
//         }
//     }

//     try {
//         const removeItemList = await listAll(removeRef)

//         await Promise.all(
//             removeItemList.items.map(async item => {
//                 try {
//                     if (item.name.split(".")[0].includes(productTitle)) {
//                         await deleteObject(item)
//                         console.log("Image deleted successfully")
//                     }
//                 } catch (error) {
//                     console.error("Error: ", error)
//                 }
//             })
//         )
//     } catch (error) {
//         console.error("Error: ", error)
//     }

//     try {
//         await Promise.all(
//             await uploadBytes(imageRef, imageFile).then(snapshot => {
//                 console.log("Uploaded a blob or file!")
//             })
//         )
//     } catch (error) {
//         console.error("Error: ", error)
//     }
// }

// 純粹上傳主圖到 Storage，回傳下載 URL 與儲存檔名；不寫 Firestore，由 caller 決定寫入時機與目標 doc
const uploadProductMainImage = async (imageFile, productTitle) => {
    const storageFileName = buildStorageFileName(imageFile, productTitle)
    const imageRef = ref(storage, `Images/products/${storageFileName}`)
    await uploadBytes(imageRef, imageFile, IMAGE_UPLOAD_METADATA)
    const downloadURL = await getDownloadURL(imageRef)
    return { mainImg: downloadURL, imageFileName: storageFileName }
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
                await uploadBytes(imageRef, file.file, IMAGE_UPLOAD_METADATA)
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

// const loginWithGoogle = async () => {
//     const provider = new GoogleAuthProvider()
//     const auth = getAuth()
//     signInWithPopup(auth, provider)
//         .then(async result => {
//             const credential = GoogleAuthProvider.credentialFromResult(result)
//             const token = credential.accessToken
//             const user = result.user
//             console.log("GoogleResult:", result)
//             // 在這邊把user資料寫入locaStorage或是進行後端寫入資料庫等等的操作
//         })
//         .catch(error => {
//             console.log(error)
//         })
// }

export {
    setUpdateSelectedProductToFirestore,
    setRemoveProductImageFromStorage,
    setRemoveProductTabImageFromStorage,
    setRemoveProductDataFromFirestore,
    setProductImageToStorage,
    setProductDataToFirestore,
    uploadProductMainImage,
    setProductTabImageToStorage,
    getProductListFromFirestore,
    getTabImagesFromStorage,
    getSubImagesFromStorage,
    getProductImagesFromStorage,
    // loginWithGoogle,
    handleLoginOrRegister,
    handleRegisterWithEmailAndPassWord,
    ResetPassword,
    handleLogoutAuth,
}
