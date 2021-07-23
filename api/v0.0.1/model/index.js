const Sequelize = require("sequelize");
const db = require("../../../core/database");

const Account = db.define("account", {
	id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		primaryKey: true,
		allowNull: false
	},
	name: {
		type: Sequelize.STRING,
		minLength: 4,
		maxLength: 255,
		allowNull: false
	},
	email: {
		type: Sequelize.STRING,
		minLength: 4,
		maxLength: 255,
		allowNull: false
	},
	password: {
		type: Sequelize.STRING,
		minLength: 1,
		maxLength: 255,
		allowNull: false
	},
	activated: {
		type: Sequelize.ENUM("Y", "N"),
		defaultValue: "N",
		allowNull: false
	}
});

const AccountSession = db.define("account_session", {
	id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		primaryKey: true,
		allowNull: false
	},
	token: {
		type: Sequelize.STRING,
		maxLength: 255,
		allowNull: false
	},
	time: {
		type: Sequelize.INTEGER(14),
		allowNull: false
	},
	activated: {
		type: Sequelize.ENUM("Y", "N"),
		defaultValue: "Y",
		allowNull: false
	}
});

const AccountVerifyCode = db.define("account_verify_code", {
	id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		primaryKey: true,
		allowNull: false
	},
	code: {
		type: Sequelize.INTEGER,
		maxLength: 6,
		allowNull: false
	}
});

Account.hasMany(AccountSession, { onDelete: 'cascade' });
Account.hasMany(AccountVerifyCode, { onDelete: 'cascade' });

const Desk = db.define("desk", {
	id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		primaryKey: true,
		allowNull: false
	},
	name: {
		type: Sequelize.STRING,
		maxLength: 255,
		allowNull: false
	},
	description: {
		type: Sequelize.STRING,
		maxLength: 255,
		allowNull: false
	}
});
Account.hasMany(Desk);

const DeskMember = db.define("desk_member", {
	id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		primaryKey: true,
		allowNull: false
	},
	type: {
		type: Sequelize.ENUM("creator", "manager", "performer"),
		defaultValue: "performer",
		allowNull: false
	}
});
Account.hasMany(DeskMember, { onDelete: 'cascade' });
Desk.hasMany(DeskMember, { onDelete: 'cascade' });

const List = db.define("list", {
	id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		primaryKey: true,
		allowNull: false
	},
	name: {
		type: Sequelize.STRING,
		maxLength: 255,
		allowNull: false
	},
	description: {
		type: Sequelize.STRING,
		maxLength: 255,
		allowNull: false
	}
});
Account.hasMany(List, { onDelete: 'cascade' });
Desk.hasMany(List, { onDelete: 'cascade' });

const Task = db.define("task", {
	id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		primaryKey: true,
		allowNull: false
	},
	name: {
		type: Sequelize.STRING,
		maxLength: 255,
		allowNull: false
	},
	target: {
		type: Sequelize.TEXT,
		maxLength: 255,
		allowNull: false
	},
	create_time: {
		type: Sequelize.INTEGER(14),
		allowNull: false
	},
	end_time: {
		type: Sequelize.INTEGER(14),
		allowNull: false
	},
	done: {
		type: Sequelize.ENUM("Y", "N"),
		defaultValue: "N",
		allowNull: false
	}
});
Account.hasMany(Task, { onDelete: 'cascade' });
List.hasMany(Task, { onDelete: 'cascade' });

const TaskPerformer = db.define("task_performer", {
	id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		primaryKey: true,
		allowNull: false
	},
	position: {
		type: Sequelize.STRING,
		defaultValue: "Performer",
		maxLength: 255,
		allowNull: false
	}
});
Account.hasMany(TaskPerformer, { onDelete: 'cascade' });
Task.hasMany(TaskPerformer, { onDelete: 'cascade' });

module.exports = {
	Account,
	AccountSession,
	AccountVerifyCode,
	Desk,
	DeskMember,
	List,
	Task,
	TaskPerformer
}