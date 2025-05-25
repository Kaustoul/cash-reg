import type { IGroup, INewGroup } from "$lib/shared/interfaces/user";

export interface GroupsDataHandler {
    newGroup(db: any, group: INewGroup): Promise<number>;
    fetchGroupById(db: any, groupId: number): Promise<IGroup | null>;
    fetchGroups(db: any): Promise<IGroup[]>;
    updateGroup(db: any, groupId: number, group: Partial<INewGroup>): Promise<void>;
    setGroupPermission(db: any, groupId: number, permissionId: string, enabled: boolean): Promise<void>;
    fetchGroupPermissions(db: any, groupId: number): Promise<string[]>;
}