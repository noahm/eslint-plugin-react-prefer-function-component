import { RuleTester } from "eslint";
import rule, {
  ALLOW_COMPONENT_DID_CATCH,
  ALLOW_JSX_IN_CLASSES,
  COMPONENT_SHOULD_BE_FUNCTION,
} from ".";

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
});

ruleTester.run("prefer-function-component", rule, {
  valid: [
    {
      // Already a stateless function
      code: `
        const Foo = function(props) {
          return <div>{props.foo}</div>;
        };
      `,
    },
    {
      // Already a stateless (arrow) function
      code: "const Foo = ({foo}) => <div>{foo}</div>;",
    },
    {
      // Extends from Component and uses componentDidCatch
      code: `
        class Foo extends React.Component {
          componentDidCatch(error, errorInfo) {
            logErrorToMyService(error, errorInfo);
          }
          render() {
            return <div>{this.props.foo}</div>;
          }
        }
      `,
    },
    {
      // Extends from Component and uses componentDidCatch
      code: `
        class Foo extends React.PureComponent {
          componentDidCatch(error, errorInfo) {
            logErrorToMyService(error, errorInfo);
          }
          render() {
            return <div>{this.props.foo}</div>;
          }
        }
      `,
    },
    {
      // Extends from Component in an expression context.
      code: `
        const Foo = class extends React.Component {
          componentDidCatch(error, errorInfo) {
            logErrorToMyService(error, errorInfo);
          }
          render() {
            return <div>{this.props.foo}</div>;
          }
        };
      `,
    },
    {
      // class without JSX
      code: `
        class Foo {
          render() {
            return 'hello'
          }
        };
      `,
    },
    {
      // non-component class with JSX
      code: `
        class Foo {
          getBar() {
            return <Bar />;
          }
        };
      `,
      options: [
        {
          [ALLOW_JSX_IN_CLASSES]: true,
        },
      ],
    },
    {
      // object with JSX
      code: `
        const foo = {
          foo: <h>hello</h>
        };
      `,
    },
  ],

  invalid: [
    // Extending from react
    {
      code: `
        import { Component } from 'react';

        class Foo extends Component {
          render() {
            return <div>{this.props.foo}</div>;
          }
        }
      `,
      errors: [
        {
          messageId: COMPONENT_SHOULD_BE_FUNCTION,
        },
      ],
    },
    // Extending from preact
    {
      code: `
        import { Component } from 'preact';

        class Foo extends Component {
          render() {
            return <div>{this.props.foo}</div>;
          }
        }
      `,
      errors: [
        {
          messageId: COMPONENT_SHOULD_BE_FUNCTION,
        },
      ],
    },
    // Extending from inferno
    {
      code: `
        import { Component } from 'inferno';

        class Foo extends Component {
          render() {
            return <div>{this.props.foo}</div>;
          }
        }
      `,
      errors: [
        {
          messageId: COMPONENT_SHOULD_BE_FUNCTION,
        },
      ],
    },
    // Extending from another class (not Component)
    {
      code: `
        import Document from 'next/document';

        class Foo extends Document {
          render() {
            return <div>{this.props.foo}</div>;
          }
        }
      `,
      errors: [
        {
          messageId: COMPONENT_SHOULD_BE_FUNCTION,
        },
      ],
    },
    {
      code: `
        class Foo extends React.Component {
          render() {
            return <div>{this.props.foo}</div>;
          }
        }
      `,
      errors: [
        {
          messageId: COMPONENT_SHOULD_BE_FUNCTION,
        },
      ],
    },
    {
      code: `
        class Foo extends React.PureComponent {
          render() {
            return <div>{this.props.foo}</div>;
          }
        }
      `,
      errors: [
        {
          messageId: COMPONENT_SHOULD_BE_FUNCTION,
        },
      ],
    },
    {
      code: `
        const Foo = class extends React.Component {
          render() {
            return <div>{this.props.foo}</div>;
          }
        };
      `,
      errors: [
        {
          messageId: COMPONENT_SHOULD_BE_FUNCTION,
        },
      ],
    },
    {
      // Extends from Component and uses componentDidCatch
      code: `
        class Foo extends React.Component {
          componentDidCatch(error, errorInfo) {
            logErrorToMyService(error, errorInfo);
          }
          render() {
            return <div>{this.props.foo}</div>;
          }
        }
      `,
      options: [
        {
          [ALLOW_COMPONENT_DID_CATCH]: false,
        },
      ],
      errors: [
        {
          messageId: COMPONENT_SHOULD_BE_FUNCTION,
        },
      ],
    },
    {
      // Extends from Component and uses componentDidCatch
      code: `
        class Foo extends React.PureComponent {
          componentDidCatch(error, errorInfo) {
            logErrorToMyService(error, errorInfo);
          }
          render() {
            return <div>{this.props.foo}</div>;
          }
        }
      `,
      options: [
        {
          [ALLOW_COMPONENT_DID_CATCH]: false,
        },
      ],
      errors: [
        {
          messageId: COMPONENT_SHOULD_BE_FUNCTION,
        },
      ],
    },
    {
      // Extends from Component in an expression context.
      code: `
        const Foo = class extends React.Component {
          componentDidCatch(error, errorInfo) {
            logErrorToMyService(error, errorInfo);
          }
          render() {
            return <div>{this.props.foo}</div>;
          }
        };
      `,
      options: [
        {
          [ALLOW_COMPONENT_DID_CATCH]: false,
        },
      ],
      errors: [
        {
          messageId: COMPONENT_SHOULD_BE_FUNCTION,
        },
      ],
    },
    {
      // Does not contain JSX and extends React.Component.
      code: `
        class Foo extends React.Component {
          render() {
            return null;
          }
        }
      `,
      errors: [
        {
          messageId: COMPONENT_SHOULD_BE_FUNCTION,
        },
      ],
    },

    {
      // Does not contain JSX and extends Component.
      code: `
        import { Component } from 'react';

        class Foo extends Component {
          render() {
            return null;
          }
        }
      `,
      errors: [
        {
          messageId: COMPONENT_SHOULD_BE_FUNCTION,
        },
      ],
    },
    {
      // Does not contain JSX and extends React.Component in an expression context.
      code: `
        const Foo = class extends React.Component {
          render() {
            return null;
          }
        };
      `,
      errors: [
        {
          messageId: COMPONENT_SHOULD_BE_FUNCTION,
        },
      ],
    },
    {
      // Does not contain JSX and extends Component in an expression context.
      code: `
        import { Component } from 'react';

        const Foo = class extends Component {
          render() {
            return null;
          }
        };
      `,
      errors: [
        {
          messageId: COMPONENT_SHOULD_BE_FUNCTION,
        },
      ],
    },
  ],
});
