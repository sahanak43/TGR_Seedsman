/* eslint-disable react/prop-types */
/* eslint-disable react/no-unused-prop-types */
/* eslint-disable react/require-default-props */
import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import './Tooltip.style';

/**
 * @class Tooltip
 * @namespace Seedsman/Component/Tooltip/Component
 */
export class TooltipComponent extends PureComponent {
    static propTypes = {
        content: PropTypes.func.isRequired,
        direction: PropTypes.string.isRequired
    };

    /**
     * Renders tooltip content
     * @returns {JSX.Element}
     */
    renderTooltipContent() {
        const {
            content,
            direction,
            isCenter
        } = this.props;

        const tooltipClass = isCenter ? `${isCenter} ${direction}` : direction;

        return (
            <div
              block="Tooltip"
              elem="ToolTipContentWrapper"
              className={ tooltipClass }
            >
                <div
                  block="Tooltip"
                  elem="ToolTipContent"
                >
                    { content() }
                </div>
            </div>
        );
    }

    /**
     * Renders tooltip button
     * @returns {JSX.Element}
     */
    renderToolTipButton() {
        return (
            <div
              block="Tooltip"
              elem="ToolTipButton"
            >
                { this.renderTooltipContent() }
                <span
                  className="tooltipButton"
                >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M10 15C10.2833 15 10.521 14.904 10.713 14.712C10.9043
                          14.5207 11 14.2833 11 14V9.975C11 9.69167 10.9043 9.45833
                          10.713 9.275C10.521 9.09167 10.2833 9 10 9C9.71667 9 9.47933
                          9.09567 9.288 9.287C9.096 9.479 9 9.71667 9 10V14.025C9
                          14.3083 9.096 14.5417 9.288 14.725C9.47933 14.9083 9.71667
                          15 10 15ZM10 7C10.2833 7 10.521 6.904 10.713 6.712C10.9043
                          6.52067 11 6.28333 11 6C11 5.71667 10.9043 5.479 10.713
                          5.287C10.521 5.09567 10.2833 5 10 5C9.71667 5 9.47933
                          5.09567 9.288 5.287C9.096 5.479 9 5.71667 9 6C9 6.28333
                          9.096 6.52067 9.288 6.712C9.47933 6.904 9.71667 7 10 7ZM10
                          20C8.61667 20 7.31667 19.7373 6.1 19.212C4.88333 18.6873
                          3.825 17.975 2.925 17.075C2.025 16.175 1.31267 15.1167
                          0.788 13.9C0.262667 12.6833 0 11.3833 0 10C0 8.61667 0.262667
                          7.31667 0.788 6.1C1.31267 4.88333 2.025 3.825 2.925 2.925C3.825
                          2.025 4.88333 1.31233 6.1 0.787C7.31667 0.262333 8.61667 0 10
                          0C11.3833 0 12.6833 0.262333 13.9 0.787C15.1167 1.31233 16.175 2.025 17.075
                          2.925C17.975 3.825 18.6873 4.88333 19.212 6.1C19.7373 7.31667 20
                          8.61667 20 10C20 11.3833 19.7373 12.6833 19.212 13.9C18.6873 15.1167
                          17.975 16.175 17.075 17.075C16.175 17.975 15.1167 18.6873 13.9 19.212C12.6833
                          19.7373 11.3833 20 10 20ZM10 18C12.2167 18 14.1043 17.221 15.663
                          15.663C17.221 14.1043 18 12.2167 18 10C18 7.78333 17.221 5.89567
                          15.663 4.337C14.1043 2.779 12.2167 2 10 2C7.78333 2 5.896 2.779
                          4.338 4.337C2.77933 5.89567 2 7.78333 2 10C2 12.2167 2.77933
                          14.1043 4.338 15.663C5.896 17.221 7.78333 18 10 18Z"
                          fill="black"
                        />
                    </svg>
                </span>
            </div>
        );
    }

    render() {
        return (
            <div
              block="Tooltip"
              elem="Wrapper"
            >
                { this.renderToolTipButton() }
            </div>
        );
    }
}

export default TooltipComponent;
