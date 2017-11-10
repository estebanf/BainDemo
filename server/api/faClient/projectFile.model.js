'use strict';

import mongoose from 'mongoose';
// import {registerEvents} from './folder.events';

var ProjectFileSchema = new mongoose.Schema({
  cs_uid: String,
  keep: Boolean
});

// registerEvents(FolderSchema);
export default mongoose.model('ProjectFile', ProjectFileSchema);
