import React, { Component } from "react";
import PropTypes from 'prop-types';
import "./Tabs.css";
import "../../utilities.css";

class Tab extends Component {
  static propTypes = {
    activeTab: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    styleName: PropTypes.string.isRequired
  };

  onClick = () => {
    const { label, onClick } = this.props;
    onClick(label);
  }

  render() {
    const { 
      onClick,
      props: {
        activeTab,
        label,
        styleName
      },
    } = this;

    let className = `${styleName}-tabListItem`;

    if (activeTab === label) {
      className += ` ${styleName}-tabListActive`;
    }

    return (
      <li 
        className={className}
        onClick={onClick}
      >
        {label}
      </li>
    );
  }
}

class Tabs extends Component {
  static propTypes = {
    children: PropTypes.instanceOf(Array).isRequired,
    styleName: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      activeTab: this.props.children[0].props.label,
    };
  }

  onClickTabItem = (tab) => {
    this.setState({ activeTab: tab });
  }

  render() {
    const {
      onClickTabItem,
      props: {
        children,
        styleName
      },
      state: {
        activeTab,
      }
    } = this;

    return (
      <div className={`${styleName}-tabs`}>
        <ol className={`${styleName}-tabList`}>
          {children.map((child) => {
            const { label } = child.props;

            return (
              <Tab
                activeTab={activeTab}
                key={label}
                label={label}
                onClick={onClickTabItem}
                styleName={styleName}
              />
            );
          })}
        </ol>
        <div className={`${styleName}-tabContent`}>
          {children.map((child) => {
            if (child.props.label !== activeTab) return undefined;
            return child.props.children;
          })}
        </div>
      </div>
    );
  }
}

export {Tabs};