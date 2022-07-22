import React, {useState, useEffect} from 'react'
import Header from './header'
import * as Utils from "../../constants/utils"
import { useNavigate ,useParams} from 'react-router-dom'

export default function ZoomMap() {
    
    const navigate = useNavigate();
    const getParams = useParams();

    const [lat] = useState<number>(Number(getParams.lat) || 0)
    const [lon] = useState<number>(Number(getParams.lon) || 0)

    //##################################################################################################################
    //##
    //## >> Override
    //##
    //##################################################################################################################

    useEffect(()=> {
        if (lat === 0 || lon === 0) {
            navigate(-1)
        }
        setMap();

    },[])
    


    //##################################################################################################################
    //##
    //## >> Method : private
    //##
    //##################################################################################################################

     /**
     * Set Map
     * -----------------------------------------------------------------------------------------------------------------
     */
      const setMap = () => {
        let position = new window.kakao.maps.LatLng(lat,lon)
        let container = document.getElementById('map'),
            mapOption = {
                center: position,
                level: 4
            }
        
        let marker = new window.kakao.maps.Marker({
            position: position
        })
        let map = new window.kakao.maps.Map(container, mapOption);
        
        if(lat !== 37.504942){
            marker.setMap(map);
        }
        
    };

    //##################################################################################################################
    //##
    //## >> Method : Default Rendering
    //##
    //##################################################################################################################

    return (
        <div>
            <Header
                title='지도 상세'
                historyBack={true}
            />
        <div id='map' style={{height: "100vh"}}></div>
        </div>
    )
}