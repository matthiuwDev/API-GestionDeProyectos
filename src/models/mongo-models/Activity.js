import mongoose from 'mongoose';

//Esquema de MongoDB para registrar actividades en la base de datos
const activitySchema = new mongoose.Schema({
  action: { 
    type: String, 
    required: true, 
    enum: ['CREATE', 'UPDATE', 'DELETE', 'ASSIGN']
  },
  entity: { 
    type: String, 
    required: true //'Task', 'UserStory'
  },
  entityId: { 
    type: Number, 
    required: true //ID de la tarea o HU
  },
  projectId: { 
    type: Number, 
    required: true //ID del proyecto al que pertenece la tarea o HU
  },
  userId: { 
    type: Number, 
    required: true //Usuario que realizó la acción
  },
  userName: { 
    type: String, 
    required: true //Desnormalización
  },
  
  
  //Para el CREATE: guardamos una foto de cómo quedó el objeto
  snapshot: { 
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  
  //Para el UPDATE: guardamos qué campos cambiaron
  changes: { 
    type: mongoose.Schema.Types.Mixed,
    default: null
  }
}, {
  timestamps: true 
});

const Activity = mongoose.model('Activity', activitySchema);
export default Activity;