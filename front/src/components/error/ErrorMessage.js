import { useAuth } from "../../contexts/AuthContext";
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

export default function ErrorMessage() {
    const { error, setError } = useAuth();

    return (
        error && (
            <Alert severity="error">
                <AlertTitle>Error</AlertTitle>
                {error}
            </Alert>
        )
    );
}