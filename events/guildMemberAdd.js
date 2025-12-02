// Autorole
if (config.autorole_id) {
  const role = member.guild.roles.cache.get(config.autorole_id);
  if (role) {
    member.roles.add(role).catch(() => { });
  }
}
  },
};
