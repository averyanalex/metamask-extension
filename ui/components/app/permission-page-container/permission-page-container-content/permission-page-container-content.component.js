import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { PLUGIN_PREFIX } from '@metamask/snap-controllers';
import PermissionsConnectHeader from '../../permissions-connect-header';
import Tooltip from '../../../ui/tooltip';
import PermissionsConnectPermissionList from '../../permissions-connect-permission-list';

export default class PermissionPageContainerContent extends PureComponent {
  static propTypes = {
    permissionsDescriptions: PropTypes.object.isRequired,
    domainMetadata: PropTypes.shape({
      extensionId: PropTypes.string,
      icon: PropTypes.string,
      host: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      origin: PropTypes.string.isRequired,
    }),
    selectedPermissions: PropTypes.object.isRequired,
    selectedIdentities: PropTypes.array,
    allIdentitiesSelected: PropTypes.bool,
  };

  static defaultProps = {
    selectedIdentities: [],
    allIdentitiesSelected: false,
  };

  static contextTypes = {
    t: PropTypes.func,
  };

  renderRequestedPermissions() {
    const {
      selectedPermissions,
      onPermissionToggle,
      permissionsDescriptions,
    } = this.props;
    const { t } = this.context;

    const items = Object.keys(selectedPermissions).map((permissionName) => {
      const isPluginPermission = permissionName.startsWith(PLUGIN_PREFIX);
      const keyablePermissionName = isPluginPermission
        ? `${PLUGIN_PREFIX}*`
        : permissionName;
      const isEthAccounts = permissionName === 'eth_accounts';

      let description;
      if (isEthAccounts) {
        description = t(permissionName);
      } else if (isPluginPermission) {
        description = permissionsDescriptions[keyablePermissionName].replace(
          '$1',
          permissionName.replace(PLUGIN_PREFIX, ''),
        );
      } else {
        description = permissionsDescriptions[keyablePermissionName];
      }

      // don't allow deselecting eth_accounts
      const isDisabled = isEthAccounts;
      const isChecked = Boolean(selectedPermissions[permissionName]);
      const title = isChecked
        ? t('permissionCheckedIconDescription')
        : t('permissionUncheckedIconDescription');

      return (
        <div
          className="permission-approval-container__content__permission"
          key={permissionName}
          onClick={() => {
            if (!isDisabled) {
              onPermissionToggle(permissionName);
            }
          }}
        >
          <CheckBox
            disabled={isDisabled}
            id={permissionName}
            className="permission-approval-container__checkbox"
            checked={isChecked}
            title={title}
          />
          <label htmlFor={permissionName}>{description}</label>
        </div>
      );
    });

    return (
      <div className="permission-approval-container__content__requested">
        <PermissionsConnectPermissionList permissions={selectedPermissions} />
      </div>
    );
  }

  renderAccountTooltip(textContent) {
    const { selectedIdentities } = this.props;
    const { t } = this.context;

    return (
      <Tooltip
        key="all-account-connect-tooltip"
        position="bottom"
        wrapperClassName="permission-approval-container__bold-title-elements"
        html={
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {selectedIdentities.slice(0, 6).map((identity, index) => {
              return (
                <div key={`tooltip-identity-${index}`}>
                  {identity.addressLabel}
                </div>
              );
            })}
            {selectedIdentities.length > 6
              ? t('plusXMore', [selectedIdentities.length - 6])
              : null}
          </div>
        }
      >
        {textContent}
      </Tooltip>
    );
  }

  getTitle() {
    const {
      domainMetadata,
      selectedIdentities,
      allIdentitiesSelected,
    } = this.props;
    const { t } = this.context;

    if (domainMetadata.extensionId) {
      return t('externalExtension', [domainMetadata.extensionId]);
    } else if (allIdentitiesSelected) {
      return t('connectToAll', [
        this.renderAccountTooltip(t('connectToAllAccounts')),
      ]);
    } else if (selectedIdentities.length > 1) {
      return t('connectToMultiple', [
        this.renderAccountTooltip(
          t('connectToMultipleNumberOfAccounts', [selectedIdentities.length]),
        ),
      ]);
    }
    return t('connectTo', [selectedIdentities[0]?.addressLabel]);
  }

  render() {
    const { domainMetadata } = this.props;
    const { t } = this.context;

    const title = this.getTitle();

    return (
      <div className="permission-approval-container__content">
        <div className="permission-approval-container__content-container">
          <PermissionsConnectHeader
            icon={domainMetadata.icon}
            iconName={domainMetadata.name}
            headerTitle={title}
            headerText={
              domainMetadata.extensionId
                ? t('allowExternalExtensionTo', [domainMetadata.extensionId])
                : t('allowThisSiteTo')
            }
            siteOrigin={domainMetadata.origin}
          />
          <section className="permission-approval-container__permissions-container">
            {this.renderRequestedPermissions()}
          </section>
        </div>
      </div>
    );
  }
}
