const supabase = require("../config/supabaseClient");

// 🔹 Create User
const createUser = async ({ name, email, passwordHash }) => {
	const { data, error } = await supabase
		.from("citymatch_users") 
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
		.from("citymatch_users") // 
		.select("*")
		.eq("email", email)
		.maybeSingle(); // Returns single user or null if not found

	if (error) {
		console.error("Find User By Email Error:", error);
		throw error;
	}

	return data; // null if not found
};

// 🔹 Find User by ID
const findUserById = async (id) => {
	const { data, error } = await supabase
		.from("citymatch_users") 
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