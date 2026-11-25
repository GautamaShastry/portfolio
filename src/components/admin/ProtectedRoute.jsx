import { Navigate } from 'react-router-dom'
import { useAppSelector } from '../../store/hooks'
import { selectIsAdminAuthenticated } from '../../store/slices/adminAuthSlice'

const ProtectedRoute = ({ children }) => {
    const isAuthenticated = useAppSelector(selectIsAdminAuthenticated)

    if (!isAuthenticated) {
        return <Navigate to="/admin/login" replace />
    }

    return children
}

export default ProtectedRoute
