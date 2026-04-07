// const { query } = require("../config/db");

// const createUser = async ({ name, email, passwordHash }) => {
// 	const result = await query(
// 		`INSERT INTO citymatch_users (name, email, password_hash)
// 		 VALUES ($1, $2, $3)
// 		 RETURNING id, name, email, created_at`,
// 		[name, email, passwordHash]
// 	);

// 	return result.rows[0];
// };

// const findUserByEmail = async (email) => {
// 	const result = await query(
// 		`SELECT id, name, email, password_hash, created_at
// 		 FROM citymatch_users
// 		 WHERE email = $1`,
// 		[email]
// 	);

// 	return result.rows[0] || null;
// };

// const findUserById = async (id) => {
// 	const result = await query(
// 		`SELECT id, name, email, created_at
// 		 FROM citymatch_users
// 		 WHERE id = $1`,
// 		[id]
// 	);

// 	return result.rows[0] || null;
// };

// module.exports = {
// 	createUser,
// 	findUserByEmail,
// 	findUserById,
// };


const supabase = require("../config/supabaseClient");

// 🔹 Create User
const createUser = async ({ name, email, passwordHash }) => {
	const { data, error } = await supabase
		.from("citymatch_users") // ✅ correct table
		.insert([
			{
				name,
				email,
				password_hash: passwordHash,
			},
		])
		.select()
		.single();

	if (error) {
		console.error("Create User Error:", error);
		throw error;
	}

	return data;
};

// 🔹 Find User by Email
const findUserByEmail = async (email) => {
	const { data, error } = await supabase
		.from("citymatch_users") // ✅ correct table
		.select("*")
		.eq("email", email)
		.maybeSingle(); // ✅ safer than single()

	if (error) {
		console.error("Find User By Email Error:", error);
		throw error;
	}

	return data; // null if not found
};

// 🔹 Find User by ID
const findUserById = async (id) => {
	const { data, error } = await supabase
		.from("citymatch_users") // ✅ correct table
		.select("*")
		.eq("id", id)
		.maybeSingle();

	if (error) {
		console.error("Find User By ID Error:", error);
		throw error;
	}

	return data;
};

module.exports = {
	createUser,
	findUserByEmail,
	findUserById,
};