import React, { useMemo } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Table, TableWrapper, Row } from 'react-native-table-component';
import { colors } from '../../../utils/colors';
import { Geist_Fonts, Poppins_Fonts } from '../../../utils/fonts';
import { Check } from '../../../utils/SvgImage';
import { scale } from '../../../utils/Responsive';

const VisaFeesCard = () => {
    const { tableData, widthArr } = useMemo(() => ({
        tableData: [
            ['Above 12 years of age', '80.00', ""],
            ['Between 6 years and\nless than 12 years of age', '40.00', ""],
            ['Less than 6 years of age', '–', ""],
        ],
        widthArr: [scale(180), scale(100), scale(130)]
    }), []);

    const data = [
        { type: 'header', content: 'Visa Fees' },
        { type: 'subtext', content: 'Schengen Short Term Type C Visa\n(Senegal Nationals and other countries)' },
        { type: 'table', content: { tableData, widthArr } },
        { type: 'notes', content: [
            'Applicants will be paying a service fee of FCA 10496 (inclusive of VAT 12%)',
            'The applicable Visa Fee and Service fee are as per the current rate of exchange set by the Embassy of Italy. They are subject to change without any notice.',
            'All the Fees are non-refundable.'
        ]}
    ];

    const renderItem = ({ item }) => {
        switch (item.type) {
            case 'header':
                return <Text style={styles.header}>{item.content}</Text>;
            case 'subtext':
                return <Text style={styles.subText}>{item.content}</Text>;
            case 'table':
                return (
                    <View horizontal showsHorizontalScrollIndicator={false}>
                        <Table borderStyle={styles.tableBorder}>
                            <Row
                                data={['', 'VISA FEE (EUR)', "Visa Fees in Nepalese currency"]}
                                widthArr={item.content.widthArr}
                                style={styles.headerRow}
                                textStyle={styles.headerText}
                            />
                            <TableWrapper>
                                {item.content.tableData.map((rowData, index) => (
                                    <Row
                                        key={index}
                                        data={rowData}
                                        widthArr={item.content.widthArr}
                                        style={[
                                            styles.row,
                                            index === 1 && { backgroundColor: colors.indexcolor }
                                        ]}
                                        textStyle={styles.rowText}
                                    />
                                ))}
                            </TableWrapper>
                        </Table>
                    </View>
                );
            case 'notes':
                return (
                    <View>
                        <Text style={styles.noteHeading}>Note:-</Text>
                        {item.content.map((note, index) => (
                            <View key={index} style={styles.bulletRow}>
                                <Check style={styles.bullet} />
                                <Text style={styles.bulletText}>{note}</Text>
                            </View>
                        ))}
                    </View>
                );
            default:
                return null;
        }
    };
    return (
        <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
        />
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        padding: scale(12),
        paddingBottom: scale(30),
    },
    header: {
        fontSize: scale(20),
        fontFamily: Geist_Fonts.Geist_SemiBold,
        color: colors.commonTextColor,
        marginBottom: scale(6),
    },
    subText: {
        fontSize: scale(13),
        color: colors.comanTextcolor2,
        marginBottom: scale(12),
        fontFamily: Poppins_Fonts.Poppins_Regular,
    },
    tableBorder: {
        borderWidth: 0.50,
        borderColor: colors.tableboder,
    },
    headerRow: {
        height: scale(45),
        backgroundColor: colors.primary,
    },
    headerText: {
        margin: scale(6),
        color: '#fff',
        fontFamily: Poppins_Fonts.Poppins_Bold,
        textAlign: "left",
        fontSize: scale(13),
    },
    row: {
        flexDirection: 'row',
        height: scale(55),
        backgroundColor: '#fff',
    },
    cell: {
        paddingHorizontal: scale(6),
        justifyContent: 'center',
    },
    cellText: {
        fontSize: scale(14),
        color: colors.comanTextcolor2,
        textAlign: "left",
        fontFamily: Poppins_Fonts.Poppins_Regular,
    },
    noteHeading: {
        marginTop: scale(14),
        marginBottom: scale(6),
        fontSize: scale(14),
        fontFamily: Poppins_Fonts.Poppins_Regular,
        color: colors.comanTextcolor2,
    },
    bulletRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: scale(6),
    },
    bullet: {
        marginTop: scale(4),
        marginRight: scale(8),
    },
    bulletText: {
        fontSize: scale(13),
        fontFamily: Poppins_Fonts.Poppins_Regular,
        color: colors.comanTextcolor2,
        flex: 1,
        lineHeight: scale(18),
    },
});

export default VisaFeesCard;