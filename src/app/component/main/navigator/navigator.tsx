const MainNavigator = () => {
  return (
    <>
       <nav id="site-menu" className="siteMenu">
        <ul aria-labelledby="site-menu">
          <li><a href={undefined} className="nav01 current">메인</a></li>
          <li><a href={undefined} className="nav02">간병내역</a></li>
          <li><a href={undefined} className="nav03 new">커뮤니티</a></li>
          <li><a href={undefined} className="nav04">마이페이지</a></li>
        </ul>
      </nav>
    </>
  )
}

export default MainNavigator;

// 현재 탭일경우 current 클래스 추가