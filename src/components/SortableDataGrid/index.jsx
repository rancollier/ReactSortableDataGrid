import React, { createContext } from "react";

let ProductListContext = createContext();
export class ProductTable extends React.Component {
    state = {
        activeValue: this.props.default ? this.props.default : null,
        sortMethod: null,
        canToggleReverse: true,
        reverse: false,
        selectSortIndex: (activeValue, sort, reverse) => {
            this.setState({ activeValue, sortMethod: sort, reverse });
        }
    };
    getDerivedStateFromProps(props, state) {
        debugger;

    }
    componentDidUpdate(prevProps, prevState) { }

    render() {
        return (
            <ProductListContext.Provider value={this.state}>
                <div className="productTable">{this.props.children}</div>
            </ProductListContext.Provider>
        );
    }
}

export const ProductHeaders = props => {
    return (
        <ProductListContext.Consumer>
            {context => {
                const children = React.Children.map(props.children, (child, index) => {

                    return React.cloneElement(child, {
                        isActive: child.props.field === context.activeValue,
                        style: {
                            backgroundColor:
                                child.props.field === context.activeValue ? "green" : "white"
                        },
                        onSort: () => {
                            return context.selectSortIndex(
                                child.props.field,
                                child.props.sort,
                                !context.reverse
                            );
                        }
                    });
                });
                return <ul id="headerUL">{children}</ul>;
            }}
        </ProductListContext.Consumer>
    );
};

export const ProductHeader = props => {
    const isActive = props.isActive;
    return (
        <li className={props.className} onClick={props.onSort} style={props.style}>
            {props.children}
        </li>
    );
};

export const ProductBody = props => {
    return (
        <ProductListContext.Consumer>
            {context => {
                const children = React.Children.map(props.children, (child, index) => {
                    return React.cloneElement(child, {
                        alertMe: () => {
                            alert(child.props.object.name);
                        }
                    });
                });
                let sortedChildren2;
                if (!context.sortMethod) {
                    sortedChildren2 = React.Children
                        .toArray(children)
                        .sort((a, b) => {
                            const propA = a.props.object[context.activeValue];
                            const propB = b.props.object[context.activeValue];

                            return propA - propB;
                        });

                    if (context.reverse) {
                        return <ul>{sortedChildren2.reverse()}</ul>;
                    }
                } else {
                    sortedChildren2 = React.Children.toArray(children).sort(
                        context.sortMethod
                    );
                }
                if (context.reverse) {
                    return <ul>{sortedChildren2.reverse()}</ul>;
                }

                return <ul>{sortedChildren2}</ul>;
            }}
        </ProductListContext.Consumer>
    );
};

export const ProductRow = props => {
    return <li className={props.className}>{props.children}</li>;
};

const products = [
    {
        name: "abc",
        platform: "m2",
        status: "Cancelled",
        version_count: "3"
    },
    {
        name: "efg",
        platform: "m1",
        status: "Draft",
        version_count: "1"
    }
];

const versionCountSort = () => { };
let Exercise = () => (
    <div className="exercise">
        <ProductTable default="name">
            <ProductHeaders>
                <ProductHeader field="name">Name</ProductHeader>
                <ProductHeader field="platform">platform</ProductHeader>
                <ProductHeader
                    ClassName="btn"
                    field="version_count"
                    sort={(a, b) => {
                        return b.props.object.version_count - a.props.object.version_count;
                    }}
                >
                    Version Count
        </ProductHeader>
                <ProductHeader field="status">status</ProductHeader>
            </ProductHeaders>
            <ProductBody>
                {products.map((product, index) => {
                    return (
                        <ProductRow className="bg-success" object={product} key={index}>
                            <div>
                                {product.name}, {product.platform}, {product.version_count}
                                {product.latest_version}, {product.status}
                            </div>
                        </ProductRow>
                    );
                })}
            </ProductBody>
        </ProductTable>
    </div>
);

export default Exercise;
