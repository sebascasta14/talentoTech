import { useNavigate } from 'react-router-dom'
import { useCreateHouseMutation, useUploadImageMutation } from '../../features/api/apiHousesSlice';
import Swal from 'sweetalert2'
import HouseForm from './HouseForm';
import { useState } from 'react';

export default function HouseFormCreate(){

    const navigate = useNavigate(); // Instanciamos la vaiable de useNavigate
    const [createHouse] = useCreateHouseMutation()
    
    const [file, setFile] = useState(null);
    const [uploadImage] = useUploadImageMutation();

    const handleChangeImage = (e) => {
        setFile(e.target.files)
    }

    const handleSubmit = async (e) => {
        e.preventDefault();        
        const newHouse = {
            address: e.target.address.value,
            city: e.target.city.value,
            state: e.target.state.value,
            size: e.target.size.value,
            type: e.target.type.value,
            zip_code: e.target.zip_code.value,
            rooms: e.target.rooms.value,
            bathrooms: e.target.bathrooms.value,
            price: e.target.price.value,
            code: e.target.code.value
        }
        try {
            const response = await createHouse(newHouse)
            if(response.data.status == "error"){
                Swal.fire({
                    position: "top-end",
                    icon: "error",
                    title: "La casa no pudo ser registrado, por favor verifique los datos",
                    showConfirmButton: false,
                    timer: 1500
                  })
            }else{
                if(file){
                    const formData = new FormData();
                    formData.append("file", file[0])
                    uploadImage({code: response.data.code, file: formData})
                }
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Casa Creada Correctamente",
                    showConfirmButton: false,
                    timer: 1500
                }).then(() => {
                    navigate('/house') // Hacemos la redireccion
                });
            }
        } catch (error) {
            console.log(error)
        }
        
    }

    return (
        <HouseForm props={{handleSubmit: handleSubmit, 
                        handleChangeImage: handleChangeImage, 
                        house:null}} />
    );
}