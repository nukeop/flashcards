export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[];

export type Database = {
    public: {
        Tables: {
            decks: {
                Row: {
                    _deleted: boolean;
                    _modified: string;
                    created_at: string;
                    description: string;
                    id: string;
                    is_public: boolean;
                    name: string;
                    user_id: string;
                };
                Insert: {
                    _deleted?: boolean;
                    _modified?: string;
                    created_at?: string;
                    description: string;
                    id?: string;
                    is_public?: boolean;
                    name: string;
                    user_id: string;
                };
                Update: {
                    _deleted?: boolean;
                    _modified?: string;
                    created_at?: string;
                    description?: string;
                    id?: string;
                    is_public?: boolean;
                    name?: string;
                    user_id?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: 'decks_user_id_fkey';
                        columns: ['user_id'];
                        isOneToOne: false;
                        referencedRelation: 'users';
                        referencedColumns: ['id'];
                    },
                ];
            };
            flashcards: {
                Row: {
                    _deleted: boolean;
                    _modified: string;
                    back: string;
                    created_at: string;
                    deck_id: string;
                    front: string;
                    id: string;
                    position: number;
                };
                Insert: {
                    _deleted?: boolean;
                    _modified?: string;
                    back: string;
                    created_at?: string;
                    deck_id: string;
                    front: string;
                    id?: string;
                    position?: number;
                };
                Update: {
                    _deleted?: boolean;
                    _modified?: string;
                    back?: string;
                    created_at?: string;
                    deck_id?: string;
                    front?: string;
                    id?: string;
                    position?: number;
                };
                Relationships: [
                    {
                        foreignKeyName: 'flashcards_deck_id_fkey';
                        columns: ['deck_id'];
                        isOneToOne: false;
                        referencedRelation: 'decks';
                        referencedColumns: ['id'];
                    },
                ];
            };
            user_profiles: {
                Row: {
                    _deleted: boolean;
                    _modified: string;
                    created_at: string;
                    display_name: string;
                    id: string;
                    user_id: string;
                };
                Insert: {
                    _deleted?: boolean;
                    _modified?: string;
                    created_at?: string;
                    display_name: string;
                    id: string;
                    user_id: string;
                };
                Update: {
                    _deleted?: boolean;
                    _modified?: string;
                    created_at?: string;
                    display_name?: string;
                    id?: string;
                    user_id?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: 'user_profiles_user_id_fkey';
                        columns: ['user_id'];
                        isOneToOne: false;
                        referencedRelation: 'users';
                        referencedColumns: ['id'];
                    },
                ];
            };
        };
        Views: {
            [_ in never]: never;
        };
        Functions: {
            [_ in never]: never;
        };
        Enums: {
            [_ in never]: never;
        };
        CompositeTypes: {
            [_ in never]: never;
        };
    };
};

type PublicSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
    PublicTableNameOrOptions extends
        | keyof (PublicSchema['Tables'] & PublicSchema['Views'])
        | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends {
        schema: keyof Database;
    }
        ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
              Database[PublicTableNameOrOptions['schema']]['Views'])
        : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
          Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
          Row: infer R;
      }
        ? R
        : never
    : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] &
            PublicSchema['Views'])
      ? (PublicSchema['Tables'] &
            PublicSchema['Views'])[PublicTableNameOrOptions] extends {
            Row: infer R;
        }
          ? R
          : never
      : never;

export type TablesInsert<
    PublicTableNameOrOptions extends
        | keyof PublicSchema['Tables']
        | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends {
        schema: keyof Database;
    }
        ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
        : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
          Insert: infer I;
      }
        ? I
        : never
    : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
      ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
            Insert: infer I;
        }
          ? I
          : never
      : never;

export type TablesUpdate<
    PublicTableNameOrOptions extends
        | keyof PublicSchema['Tables']
        | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends {
        schema: keyof Database;
    }
        ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
        : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
          Update: infer U;
      }
        ? U
        : never
    : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
      ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
            Update: infer U;
        }
          ? U
          : never
      : never;

export type Enums<
    PublicEnumNameOrOptions extends
        | keyof PublicSchema['Enums']
        | { schema: keyof Database },
    EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
        ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
        : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
    ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
    : PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
      ? PublicSchema['Enums'][PublicEnumNameOrOptions]
      : never;
