import * as React from 'react';
import styles from './Egg.module.scss';

export interface IEggProps {
    imgSrc: string;
}

export const Egg = (props: IEggProps): JSX.Element => {

    const [isOpen, setIsOpen] = React.useState(false);

    const eggImages = {
        '--eggPlain': `url(${require('../assets/eggPlain.svg')})`,
        '--eggHalf': `url(${require('../assets/eggHalf.svg')})`,
        '--user': `url(${props.imgSrc})`,
    }

    return (
        <div
            className={styles.egg}
            style={eggImages as React.CSSProperties}
            onClick={() => setIsOpen(!isOpen)}
        >
            <div className={isOpen ? styles.open : styles.closed} />
        </div>
    );
};