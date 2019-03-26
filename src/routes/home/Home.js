import React from 'react';

import { Card } from 'antd';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Link from '../../components/Link';

/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable react/jsx-no-comment-textnodes */
import s from './Home.css';

class Home extends React.Component {
  render() {
    return (
      <div className={s.overHolder}>
        <h2>Task: Team Status</h2>
        <Card>
          <p>
            Your task is to build a team status page where anyone can see
            (without access restrictions) basic information about all team
            members.
          </p>
          <ul>
            <li>list of all team members</li>
            <li>easily see if someone is on holidays</li>
            <li>easily see who is working on which project</li>
            <li>easily see and search people with particular skills</li>
            <li>see if they are working right now or not</li>
            <li>
              see a list of people that have given skills (for example js OR
              python)
            </li>
            <li>assign people to the project</li>
          </ul>
          <p>It's up to you to design the UI.</p>

          <p>
            Imaginary API should have endpoints like (there is no API you need
            to somehow stub it out on your end - or even write a simple server
            with hardcoded responses).{' '}
            <a target="_blank" href="https://pastebin.com/sAqpShwu6">
              https://pastebin.com/sAqpShwu
            </a>
          </p>
          <pre>
            /team // returns all team members <br />
            /team?skill=js&skill=python // returns all team members with skill
            js AND python
            <br />
            /team?project=2 // all team members that are on project with id 2
            <br />
            /team?holidays=true // all team members that are on holidays
            <br />
            /team?working=true // all team members that are right now in working
            hours
          </pre>
          <p>
            Each API is paginated so the response looks like this:
            <br />
            <a
              target="_blank"
              href="https://jsonbin.io/5c7d48430e7529589338f5c6"
            >
              https://jsonbin.io/5c7d48430e7529589338f5c6
            </a>
          </p>
          <p>
            To get the second page you should do:
            <br />
            GET /api/team?page=2
          </p>
        </Card>
        <br />
        <br />
        <h2>Rules</h2>
        <Card>
          It's ok to:
          <ul>
            <li>use any open source libraries (for API, styling).</li>
            <li>it's ok to have the project setup in any way you prefer.</li>
            <li>
              it's ok to ask us any questions about the project (you can contact
              us at xxxxx@xxxxxx.com, xxxxx@xxxxxxxx.com).
            </li>
            <li>look for UI inspiration on the internet</li>
          </ul>
          It's not ok to:
          <ul>
            <li>ask someone else to write it for you.</li>
            <li>
              take someone's code, change it a little bit, and say it is yours.
            </li>
          </ul>
          You must:
          <ul>
            <li>deliver the project before the deadline</li>
            <li>
              we have to be able to start the app locally following simple
              instructions (ideally one or two commends)
            </li>
            <li>
              Task deadline is XXth March, 20XX you should send us the solution
              by sending us a link (you can reply to this email) to your GitHub
              repo.
            </li>
          </ul>
          <p>
            For an API you may want to look at:{' '}
            <a
              href="https://medium.freecodecamp.org/rapid-development-via-mock-apis-e559087be066https://github.com/typicode/json-server"
              target="_blank"
            >
              https://medium.freecodecamp.org/rapid-development-via-mock-apis-e559087be066https://github.com/typicode/json-server
            </a>
          </p>
          <p>
            Thanks for your time. We really appreciate you putting in the effort
            to work with us.
          </p>
        </Card>
        <br />
        <br />
        <h2>Solution</h2>
        <Card>
          <h3>Tech stack</h3>
          <p>
            This task can be beginning of something more valuable. That's why I
            am decided to use real DB from beginning. And I chose MongoDB:{' '}
          </p>
          <ul>
            <li>It can be setup within same project.</li>
            <li>It can be stored in cloud for demo.</li>
            <li>It is good opportunity to learn it.</li>
          </ul>

          <p>
            I taked{' '}
            <a
              href="https://github.com/kriasoft/react-starter-kit"
              target="_blank"
            >
              react-starter-kit
            </a>{' '}
            like boilerplate for this project. Removed all unnecessary
            components and added Mongoose, ant.design and some other service
            libs like momen or lodash .{' '}
            <a href="https://ant.design" target="_blank">
              Ant.design
            </a>{' '}
            is one of the best UI framework for React for now. It gives me all
            necessary functionality to make this project success: UI, sorting
            and filtering for Table content
          </p>
          <p>Let's go!</p>
          <br />
          <h3>Development flow</h3>
          <ul>
            <li>Backend configuration</li>
            <li>Routes configuration</li>
            <li>Layout setup</li>
            <li>Developing service components</li>
            <li>Developing team component</li>
            <li>QA Testing</li>
            <li>Deploy</li>
          </ul>

          <p>
            As we can se in provided Team Member sample object, we need at least
            three service Collections: <Link to="/managers">Managers</Link>,{' '}
            <Link to="/projects">Projects</Link> and{' '}
            <Link to="/skills">Skills</Link>. Check it. You can Add, Edit and
            delete items there.
          </p>
          <p>
            It used in Worker object like referred collections. So, any changes
            in them will be automatically seen in <Link to="/team">Team</Link>{' '}
            view.{' '}
          </p>
          <p>
            This components is not necessary parts for current task. So I made
            simple API for it. No pagination, no sorting. Just GET all items,
            POST new, PUT on edit and DELETE API calls. And it is not comments
            in code there. Just for make this task faster.
          </p>
          <p>
            This components also have major validation: Required and Already
            exists.
          </p>
          <br />
          <h3>Major task. Team</h3>
          <p>
            I decided to use Table view for display Team Members (instead cards,
            for example)
          </p>
          <p>
            It's because table is eye comfortable solution. User can catch all
            necessary data in one look.
          </p>
          <p>
            In additional to API requested functionality, sorting option was
            added. It follow from pagination request:
            <pre>
              ?page=1&limit=10&sortColumn=onHolidaysTill&sortOrder=ascend&matchColumn=freeSince&matchIn=true
            </pre>
          </p>
          <p>
            You can sort by Name, On Holidays Till, Free Since, Project and
            Manager
          </p>
          <p>
            You can filter Skills, Projects and Managers. Also you can view who
            is on Holidays or Free.
          </p>
          <p>
            Column Filters working with AND logic. Skills working with OR logic.
          </p>
          <p>
            Working status is calculating according provided time and timeZone.
            It also depends on On Holidays and Free Since dates.
          </p>

          <p>
            That's it. Thanks for reading.
            <br />
            Kind regards, Ivan.
          </p>
        </Card>
      </div>
    );
  }
}

export default withStyles(s)(Home);
