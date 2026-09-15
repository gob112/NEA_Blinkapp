import { createContext, useContext, useState } from "react";

//context to alow email and flag and corresponding funtions to be used by other componets

export const contextData = createContext("");

 const ContextDataProvider = (props) => {
    
    const [flag, setFlag] = useState(0)
    const [email, setEmail] = useState("test")
    const [Em,setEm ]= useState("")
    const [timer,settimer ]= useState(20000)
    const [blink_timer,setBlink_timer ]= useState(1200000)
    const [ibi_timer,setIbi_timer ]= useState(300000)

    const changeFlag =() =>{
        setFlag (!flag)
    }

    const changeEmail = (e) => {
        setEmail(e.target.value)
        setEm(e.target.value)
    }
    return (
        <contextData.Provider value={{
            flag,
            setEmail,
            setFlag,
            email,
            changeEmail,
            changeFlag,
            Em, 
            setEm,
            setBlink_timer,
            setIbi_timer,
            settimer,
            timer,
            blink_timer,
            ibi_timer
        }}>
            {props.children}
        </contextData.Provider>
    )
}

export const useContextData = () => useContext(contextData)
export default ContextDataProvider;