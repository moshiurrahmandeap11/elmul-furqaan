import { useContext } from "react"
import { AuthContext } from "../../provider/AuthContexts/AuthContexts"

const useAuth = () => {
    return useContext(AuthContext)
}

export default useAuth