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
                    created_at: string;
                    description: string;
                    id: string;
                    is_public: boolean;
                    name: string;
                    user_id: string;
                };
                Insert: {
                    created_at?: string;
                    description: string;
                    id?: string;
                    is_public?: boolean;
                    name: string;
                    user_id: string;
                };
                Update: {
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
                    back: string;
                    created_at: string;
                    deck_id: string;
                    front: string;
                    id: string;
                    position: number;
                };
                Insert: {
                    back: string;
                    created_at?: string;
                    deck_id: string;
                    front: string;
                    id?: string;
                    position?: number;
                };
                Update: {
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
                        referencedRelation: 'deck_cards_view';
                        referencedColumns: ['deck_id'];
                    },
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
                    created_at: string;
                    display_name: string;
                    id: string;
                    user_id: string;
                };
                Insert: {
                    created_at?: string;
                    display_name: string;
                    id: string;
                    user_id: string;
                };
                Update: {
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
            deck_cards_view: {
                Row: {
                    card_back: string | null;
                    card_created_at: string | null;
                    card_front: string | null;
                    card_id: string | null;
                    card_position: number | null;
                    card_updated_at: string | null;
                    deck_created_at: string | null;
                    deck_description: string | null;
                    deck_id: string | null;
                    deck_name: string | null;
                    deck_updated_at: string | null;
                };
                Relationships: [];
            };
        };
        Functions: {
            ddlx_get_dependants: {
                Args: {
                    '': unknown;
                };
                Returns: Record<string, unknown>[];
            };
            get_next_card_position: {
                Args: {
                    deck_id_arg: string;
                };
                Returns: number;
            };
            update_card_positions: {
                Args: {
                    card_ids: string[];
                    new_positions: number[];
                };
                Returns: undefined;
            };
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
