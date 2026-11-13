import { useRecoilValue } from 'recoil';
import { userWorkspaceManagementListSelector } from 'state/user-workspace-management';
import styled from 'styled-components';

import Title from 'components/Common/Admin/Title';
import Card from 'components/Common/User/Card';
import Layout from 'components/Layout';
import Header from 'components/Layout/Header';

const Container = styled.section`
  padding: 34px 40px 40px;
  overflow-x: auto;
  & > ul {
    gap: 20px;
    margin-top: 20px;
    display: flex;
    flex-wrap: wrap;
    & > li {
      /* &:nth-of-type(n + 5) {
        margin-top: 20px;
      } */
      &:nth-of-type(4n) {
        margin-right: 0;
      }
    }
  }
`;

const UserManagementWorkspace = () => {
  const sidebarList = useRecoilValue(userWorkspaceManagementListSelector);

  return (
    <Layout type="user">
      <Header>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <b>Home</b>
        </div>
      </Header>
      <Container>
        <Title className="title-box" title="Home" />
        <ul>
          {sidebarList.map((item) => (
            <Card key={item.workspace_id} workspace={item} isViewer={false} />
          ))}
        </ul>
      </Container>
    </Layout>
  );
};

export default UserManagementWorkspace;
