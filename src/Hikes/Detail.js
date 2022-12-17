import { Navigate, useParams } from "react-router-dom";

function Detail() {
    let { id } = useParams();

    if(!(/^\d+$/.test(id))){
        console.log(`"${id}" is not an id. Redirecting to root.`);
        return (
            <Navigate to="/" replace />
        )
    }

    return (
        <div>I am the detail page of an individual hike with ID {id}</div>
    );
}

export default Detail;