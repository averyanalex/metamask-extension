import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';

import { useI18nContext } from '../../../hooks/useI18nContext';
import { KEYRING_TYPES } from '../../../../shared/constants/hardware-wallets';

export default function KeyRingLabel(props) {
    const t = useI18nContext();
  
    const {keyring} = props;

    const [label, setLabel] = useState(null);

    // Effect #1 Sets keyring label
    useEffect(() => {

        console.log(keyring, 'KEYY')
        // Keyring value might take a while to get a value
        if(keyring) {   
            const { type } = keyring;
            if(type === KEYRING_TYPES.QR) {
                setLabel(t('hardware'));
            }
            else if(type === 'Simple Key Pair') {
                setLabel(t('imported'));
            }
            else if(type === KEYRING_TYPES.TREZOR) {
                setLabel('Trezor');
            }
            else if(type === KEYRING_TYPES.LEDGER) {
                setLabel('Ledger');
            }
            else if(type === KEYRING_TYPES.LATTICE) {
                setLabel('Lattice')
            }
        }

    }, [props.keyring])

  return (
      <>
        {label ? <div className="keyring-label allcaps">{label}</div> : null}
      </>
  );
}

KeyRingLabel.propTypes = {
  keyring: PropTypes.object
};
