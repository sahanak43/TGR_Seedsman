/* eslint-disable max-lines */
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import MyAccountQuery from 'Query/MyAccount.query';
import { ACCOUNT_LOGIN_URL, ACCOUNT_URL } from 'Route/MyAccount/MyAccount.config';
import {
    MyAccountInformationContainer as ParentMyAccountInformationContainer
} from 'SourceComponent/MyAccountInformation/MyAccountInformation.container';
import { updateCustomerDetails, updateIsLoading, updateIsLocked } from 'Store/MyAccount/MyAccount.action';
import { CUSTOMER } from 'Store/MyAccount/MyAccount.dispatcher';
import { showNotification } from 'Store/Notification/Notification.action';
import { CustomerType } from 'Type/Account.type';
import { LocationType } from 'Type/Router.type';
import { isSignedIn } from 'Util/Auth';
import BrowserDatabase from 'Util/BrowserDatabase';
import history from 'Util/History';
import { fetchMutation, getErrorMessage } from 'Util/Request';
import { ONE_MONTH_IN_SECONDS } from 'Util/Request/QueryDispatcher';
import { appendWithStoreCode, replace } from 'Util/Url';

import MyAccountInformation from './MyAccountInformation.component';

export const MyAccountDispatcher = import(
    /* webpackMode: "lazy", webpackChunkName: "dispatchers" */
    'Store/MyAccount/MyAccount.dispatcher'
);

/** @namespace Seedsman/Component/MyAccountInformation/Container/mapStateToProps */
export const mapStateToProps = (state) => ({
    isMobile: state.ConfigReducer.device.isMobile,
    customer: state.MyAccountReducer.customer,
    isLoading: state.MyAccountReducer.isLoading,
    isLocked: state.MyAccountReducer.isLocked,
    baseLinkUrl: state.ConfigReducer.base_link_url
});

/** @namespace Seedsman/Component/MyAccountInformation/Container/mapDispatchToProps */
export const mapDispatchToProps = (dispatch) => ({
    updateCustomer: (customer) => dispatch(updateCustomerDetails(customer)),
    showErrorNotification: (error) => dispatch(showNotification(
        'error',
        typeof error === 'string' ? error : getErrorMessage(error)
    )),
    showSuccessNotification: (message) => dispatch(showNotification('success', message)),
    updateCustomerLoadingStatus: (status) => dispatch(updateIsLoading(status)),
    logout: () => MyAccountDispatcher.then(
        ({ default: dispatcher }) => dispatcher.logout(false, false, dispatch)
    ),
    updateIsLocked: (isLocked) => dispatch(updateIsLocked(isLocked))
});

/** @namespace Seedsman/Component/MyAccountInformation/Container */
export class MyAccountInformationContainer extends ParentMyAccountInformationContainer {
    static propTypes = {
        customer: CustomerType.isRequired,
        location: LocationType.isRequired,
        baseLinkUrl: PropTypes.string.isRequired,

        isLoading: PropTypes.bool.isRequired,
        isLocked: PropTypes.bool.isRequired,
        isMobile: PropTypes.bool.isRequired,

        showErrorNotification: PropTypes.func.isRequired,
        showSuccessNotification: PropTypes.func.isRequired,
        updateCustomer: PropTypes.func.isRequired,
        updateCustomerLoadingStatus: PropTypes.func.isRequired,
        logout: PropTypes.func.isRequired,
        updateIsLocked: PropTypes.func.isRequired
    };

    containerFunctions = {
        onCustomerSave: this.onCustomerSave.bind(this),
        handleChangeEmailCheckbox: this.handleChangeEmailCheckbox.bind(this),
        handleChangePasswordCheckbox: this.handleChangePasswordCheckbox.bind(this)
    };

    onError = this.onError.bind(this);

    __construct(props) {
        super.__construct(props);

        const {
            location: {
                state: {
                    editPassword = false
                } = {}
            }
        } = this.props;

        this.state = {
            showEmailChangeField: false,
            showPasswordChangeField: editPassword,
            isErrorShow: false
        };
    }

    containerProps() {
        const { isMobile, customer, isLoading } = this.props;
        const { showEmailChangeField, showPasswordChangeField } = this.state;

        return {
            isMobile,
            isLoading,
            customer,
            showEmailChangeField,
            showPasswordChangeField
        };
    }

    onError(error) {
        const { showErrorNotification } = this.props;

        showErrorNotification(error);
    }

    async onCustomerSave(fields) {
        const { updateCustomerLoadingStatus } = this.props;
        const {
            firstname = '',
            lastname = '',
            taxvat = '',
            password = '',
            newPassword = '',
            email = '',
            date_of_birth = ''
        } = fields;

        if (!isSignedIn()) {
            return;
        }

        updateCustomerLoadingStatus(true);
        try {
            if (password && newPassword) {
                await this.handlePasswordChange({ password, newPassword });
            }

            if (email && password) {
                await this.handleEmailChange({ email, password });
            }

            await this.handleInformationChange({
                firstname, lastname, taxvat, date_of_birth
            });

            this.handleSuccessChange();
        } catch (e) {
            this.handleLockAccount(e);
        }
    }

    handleSuccessChange() {
        const {
            showSuccessNotification, updateCustomerLoadingStatus
        } = this.props;
        const {
            showEmailChangeField, showPasswordChangeField
        } = this.state;

        updateCustomerLoadingStatus(false);

        if (showEmailChangeField || showPasswordChangeField) {
            this.handleLogout({ isFromEmailChange: true });
        } else {
            history.push({ pathname: appendWithStoreCode(ACCOUNT_URL) });
        }

        showSuccessNotification('You saved the account information.');
    }

    handleLogout(state) {
        const { baseLinkUrl, logout } = this.props;

        const path = baseLinkUrl
            ? appendWithStoreCode(ACCOUNT_LOGIN_URL)
            : replace(/\/customer\/account\/.*/, ACCOUNT_LOGIN_URL);

        history.push({
            pathname: path,
            state
        });

        logout();
    }

    async handlePasswordChange(passwords) {
        const mutation = MyAccountQuery.getChangeCustomerPasswordMutation(passwords);

        await fetchMutation(mutation);
    }

    async handleInformationChange(options) {
        const {
            updateCustomer
        } = this.props;

        const mutation = MyAccountQuery.getUpdateInformationMutation(options);

        const { updateCustomerV2: { customer } } = await fetchMutation(mutation);
        BrowserDatabase.setItem(customer, CUSTOMER, ONE_MONTH_IN_SECONDS);
        updateCustomer(customer);
    }

    async handleEmailChange(fields) {
        const mutation = MyAccountQuery.getUpdateEmailMutation(fields);

        await fetchMutation(mutation);
    }

    handleLockAccount(e) {
        const { updateIsLocked, updateCustomerLoadingStatus } = this.props;
        const { message } = e[0];

        updateCustomerLoadingStatus(false);

        if (message.includes('locked')) {
            updateIsLocked(true);
            return;
        }

        this.onError(e);
    }

    handleChangePasswordCheckbox() {
        const { showPasswordChangeField } = this.state;

        this.setState({
            showPasswordChangeField: !showPasswordChangeField,
            showEmailChangeField: false
        });
    }

    handleChangeEmailCheckbox() {
        const { showEmailChangeField } = this.state;

        this.setState({
            showEmailChangeField: !showEmailChangeField,
            showPasswordChangeField: false
        });
    }

    render() {
        return (
            <MyAccountInformation
              { ...this.containerProps() }
              { ...this.containerFunctions }
            />
        );
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MyAccountInformationContainer));