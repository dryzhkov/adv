import React from 'react';
import Image from 'react-bootstrap/Image';
import './Avatar.css';

export const Avatar = (props: {
    user: { picture: string; name: string; email: string };
}) => {
    const { user } = props;
    return (
        <div>
            <Image
                src={user.picture}
                alt={user.name}
                roundedCircle
                className="profile-pic"
            />
            <h2>{user.name}</h2>
            <p>{user.email}</p>
        </div>
    );
};
