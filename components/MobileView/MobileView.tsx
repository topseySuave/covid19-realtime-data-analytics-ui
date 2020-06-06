import React, { ReactText } from 'react';

interface Props {
  theme: string
}

export const MobileView: React.FC<Props> = (props) => {

	return (
    <div className={`mobile-text text-red-600 ${props.theme === 'dark' ? 'bg-gray-900' : 'bg-gray-400'}`}>
      You have opened this on a Mobile or tablet device. Please use a desktop for the best viewing experience.
    </div>
	)
}

export default MobileView;
