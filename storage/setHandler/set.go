package sethandler

type Set map[string]struct{}

type SetData struct {
	Name map[string]Set
}

// Adds item to the set and returns the size to be added to final size
func (setData *SetData) AddToSet(key, value string) int {
	_, ok := setData.Name[key]
	if !ok {
		setData.Name[key] = make(Set)
	}
	_, ok = setData.Name[key][value]
	if !ok {
		setData.Name[key][value] = struct{}{}
		return len(value)
	}
	return 0
}

// Removes item from set and returns if the operation succeeded along with the size to be deleted from final size
func (setData *SetData) RemoveFromSet(key, value string) (bool, int) {
	_, ok := setData.Name[key]
	if !ok {
		return false, 0
	}
	_, ok = setData.Name[key][value]
	if !ok {
		return false, 0
	}
	delete(setData.Name[key], value)
	return true, len(value)
}

// Returns if the value exists or not in the set
func (setData *SetData) ExistsInSet(key, value string) bool {
	_, ok := setData.Name[key]
	if !ok {
		return false
	}
	_, ok = setData.Name[key][value]
	if !ok {
		return false
	}
	return true
}

// Returns the map/set with the data
func (setData *SetData) GetMembers(key string) Set {
	data, ok := setData.Name[key]
	if !ok {
		return nil
	}
	return data
}
