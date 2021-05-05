import React from 'react';

export default function MarkdownHelp() {
  // todo
  // style this and pretty it up
  return (
    <table className="markdown-reference">
      <thead>
        <tr>
          <th>Type</th>
          <th className="second-example">Or</th>
          <th>… to Get</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="preformatted">*Italic*</td>
          <td className="preformatted second-example">_Italic_</td>
          <td>
            <em>Italic</em>
          </td>
        </tr>
        <tr>
          <td className="preformatted">**Bold**</td>
          <td className="preformatted second-example">__Bold__</td>
          <td>
            <strong>Bold</strong>
          </td>
        </tr>
        <tr>
          <td className="preformatted"># Heading 1</td>
          <td className="preformatted second-example">
            Heading 1<br />
            =========
          </td>
          <td>
            <h1 className="smaller-h1">Heading 1</h1>
          </td>
        </tr>
        <tr>
          <td className="preformatted">## Heading 2</td>
          <td className="preformatted second-example">
            Heading 2<br />
            ---------
          </td>
          <td>
            <h2 className="smaller-h2">Heading 2</h2>
          </td>
        </tr>
        <tr>
          <td className="preformatted">[Link](http://a.com)</td>
          <td className="preformatted second-example">
            [Link][1]
            <br />
            ⋮<br />
            [1]: http://b.org
          </td>
          <td>
            <a href="https://commonmark.org/">Link</a>
          </td>
        </tr>
        <tr>
          <td className="preformatted">![Image](http://url/a.png)</td>
          <td className="preformatted second-example">
            ![Image][1]
            <br />
            ⋮<br />
            [1]: http://url/b.jpg
          </td>
          <td>
            <img
              src="images/favicon.png"
              width="36"
              height="36"
              alt="Markdown"
            />
          </td>
        </tr>
        <tr>
          <td className="preformatted">&gt; Blockquote</td>
          <td className="preformatted second-example">&nbsp;</td>
          <td>
            <blockquote>Blockquote</blockquote>
          </td>
        </tr>
        <tr>
          <td className="preformatted">
            <p>
              * List
              <br />
              * List
              <br />* List
            </p>
          </td>
          <td className="preformatted second-example">
            <p>
              - List
              <br />
              - List
              <br />
              - List
              <br />
            </p>
          </td>
          <td>
            <ul>
              <li>List</li>
              <li>List</li>
              <li>List</li>
            </ul>
          </td>
        </tr>
        <tr>
          <td className="preformatted">
            <p>
              1. One
              <br />
              2. Two
              <br />
              3. Three
            </p>
          </td>
          <td className="preformatted second-example">
            <p>
              1) One
              <br />
              2) Two
              <br />
              3) Three
            </p>
          </td>
          <td>
            <ol>
              <li>One</li>
              <li>Two</li>
              <li>Three</li>
            </ol>
          </td>
        </tr>
        <tr>
          <td className="preformatted">
            Horizontal rule:
            <br />
            <br />
            ---
          </td>
          <td className="preformatted second-example">
            Horizontal rule:
            <br />
            <br />
            ***
          </td>
          <td>
            Horizontal rule:
            <hr className="custom-hr" />
          </td>
        </tr>
        <tr>
          <td className="preformatted">`Inline code` with backticks</td>
          <td className="preformatted second-example">&nbsp;</td>
          <td>
            <code className="preformatted">Inline code</code> with backticks
          </td>
        </tr>
        <tr>
          <td className="preformatted">
            ```
            <br />
            # code block
            <br />
            print '3 backticks or'
            <br />
            print 'indent 4 spaces'
            <br />
            ```
          </td>
          <td className="preformatted second-example">
            <span className="spaces">····</span># code block
            <br />
            <span className="spaces">····</span>print '3 backticks or'
            <br />
            <span className="spaces">····</span>print 'indent 4 spaces'
          </td>
          <td>
            <div className="code-block">
              # code block
              <br /> print '3 backticks or'
              <br /> print 'indent 4 spaces'
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  );
}
