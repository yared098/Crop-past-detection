import { useNavigate } from 'react-router-dom';
import React from 'react';
import ReactDOM from 'react-dom';

const NavigateToComponent = ({ path }) => {
    const navigate = useNavigate();
    React.useEffect(() => {
        navigate(path);
    }, [navigate, path]);
    return null;
};

export const navigateTo = (path) => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const root = ReactDOM.createRoot(container);
    root.render(<NavigateToComponent path={path} />);
};
