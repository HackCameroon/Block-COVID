pragma solidity ^0.5.0;

contract Hotspots {
  uint public regionCount = 0;

  struct Region {
    uint id;
    string content;
    bool completed;
  }

  mapping(uint => Region) public Regions;

  event RegionCreated(
    uint id,
    string content,
    bool completed
  );

  event RegionCompleted(
    uint id,
    bool completed
  );

  function createRegion(string memory _content) public {
    regionCount ++;
    Regions[regionCount] = Region(regionCount, _content, false);
    emit RegionCreated(regionCount, _content, false);
  }

  function toggleCompleted(uint _id) public {
    Region memory _Region = Regions[_id];
    _Region.completed = !_Region.completed;
    Regions[_id] = _Region;
    emit RegionCompleted(_id, _Region.completed);
  }

}
