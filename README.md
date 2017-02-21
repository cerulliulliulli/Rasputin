# Rasputin
Small bot geared towards supporting Destiny Discord servers.  Currently, role management is the main focus.  Role names are not case-sensitive.

# Admin Commands
### .allow \<Role Name\>
This command will allow a specific role to be self-assignable, via the Public Command `.gr <Role Name>`.

Usage `.allow <Role Name>`

### .disallow \<Role Name\>
This command will disallow a specific role to be self-assignable.

Usage `.disallow <Role Name>`

### .sync
If an Admin removes a server role without running `.disallow <Role Name>`, the role still exists within the guild-storage.  In this instance, running `.sync` will remove any roles from guild-storage that are not current server roles.

Usage `.sync`

### .list
This command will display all of the roles that are available to be allowed/disallowed and their current status.  An admin user will see all roles and their statuses.

Usage `.list`

# User Commands
### .gr \<Role Name\>
This command will assign a specific role to yourself.

Usage `.gr <Role Name>`

### .dr \<Role Name\>
This command will remove a specific role to yourself.

Usage `.dr <Role Name>`

### .list
This command will display all of the roles that are available to be allowed/disallowed and their current status.  A public user will only see roles that have been allowed.

Usage `.list`

# Links
- [Add Rasputin to your server](https://discordapp.com/oauth2/authorize?&client_id=275830693299486731&scope=bot&permissions=150528)
